import { payloadPlugin } from '@payloadcms/tanstack-start/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLogger, defineConfig, mergeConfig } from 'vite'

const logger = createLogger()
const shouldSuppress = (msg: string) =>
  msg.includes('points to missing source files') ||
  msg.includes('Sourcemap for') // covers any sourcemap-related warning variants

const originalWarn = logger.warn.bind(logger)
logger.warn = (msg, options) => {
  if (typeof msg === 'string' && shouldSuppress(msg)) return
  originalWarn(msg, options)
}
const originalWarnOnce = logger.warnOnce.bind(logger)
logger.warnOnce = (msg, options) => {
  if (typeof msg === 'string' && shouldSuppress(msg)) return
  originalWarnOnce(msg, options)
}

const originalConsoleInfo = console.info.bind(console)
console.info = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('was modified by another process')) return
  originalConsoleInfo(...args)
}
const originalConsoleLog = console.log.bind(console)
console.log = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('was modified by another process')) return
  originalConsoleLog(...args)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig((env) =>
  mergeConfig(
    payloadPlugin({
      additionalAliases: [
        {
          find: /^@\//,
          replacement: path.resolve(__dirname, 'src') + '/',
        },
      ],
      additionalOptimizeDepsInclude: ['react/compiler-runtime'],
      payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts'),
      plugins: [nitro()],
      reactPlugin: viteReact({
        exclude: [],
        include: /\.[jt]sx?$/,
      }),
      rscPlugin: rsc({ serverHandler: false }),
      tanstackStart,
    })(env),
    {
      customLogger: logger,
      // `payloadPlugin` opts into lightningcss for CSS minification, but
      // lightningcss 1.32.0 rejects `@keyframes` nested inside a style rule
      // (valid CSS nesting the Lexical editor styles emit). Use esbuild instead.
      build: { cssMinify: 'esbuild' },
      // `@payloadcms/figma` isn't in tanstack-start's noExternal allowlist, so it
      // stays external and its transitive `@payloadcms/ui` CSS imports hit Node's
      // loader ("Unknown file extension .css"). Force Vite to process it instead.
      environments: {
        rsc: {
          resolve: { noExternal: ['@payloadcms/figma'] },
          build: { rollupOptions: { external: ['pg', 'pg-native', 'pg-cloudflare'] } },
        },
        ssr: {
          resolve: { noExternal: ['@payloadcms/figma'] },
          build: { rollupOptions: { external: ['pg', 'pg-native', 'pg-cloudflare'] } },
        },
      },
      ssr: {
        noExternal: ['@payloadcms/figma'],
        external: ['pg', 'pg-native', 'pg-cloudflare'],
      },
      resolve: {
        alias: [
          // Radix scroll-lock deps (react-remove-scroll, use-callback-ref, etc.)
          // import `tslib`. Rolldown resolves it to the UMD build, which self-marks
          // `__esModule: true`, so its `__toESM` helper never synthesizes `.default`
          // — the bundled consumer then destructures `__extends` off `undefined` and
          // the server crashes at boot. Pin tslib to its ESM entry (named exports,
          // no CJS interop) to sidestep it.
          {
            find: /^tslib$/,
            replacement: path.resolve(__dirname, 'node_modules', 'tslib', 'tslib.es6.mjs'),
          },
          // Payload's barrel transitively pulls `prettier` (CJS) into the client
          // bundle via `configToJSONSchema` → `json-schema-to-typescript`. That
          // path is type-gen only and never runs in the browser, so stub it to
          // keep the client build from choking on prettier's `index.cjs`.
          {
            find: /^prettier$/,
            replacement: path.resolve(__dirname, 'src', 'stubs', 'prettier.ts'),
          },
          // Payload registers the Vercel Blob client upload handler in `importMap.js`
          // and renders it as a wrapper around the admin tree. The real handler pulls
          // `@vercel/blob/client` (→ `undici`, `async-retry`'s browser `require()`) into
          // the client bundle, crashing the admin and tripping import-protection. Swap it
          // for a children-passthrough stub; server-side blob ops use `@vercel/blob`.
          {
            find: /^@payloadcms\/storage-vercel-blob\/client$/,
            replacement: path.resolve(__dirname, 'src', 'stubs', 'vercel-blob-client.ts'),
          },
        ],
      },
      css: {
        preprocessorOptions: {
          scss: {
            importers: [
              {
                findFileUrl(url: string) {
                  if (url.startsWith('~@payloadcms/ui/scss')) {
                    return new URL(
                      'file://' +
                        path.resolve(
                          __dirname,
                          'node_modules/@payloadcms/ui/dist/scss/styles.scss',
                        ),
                    )
                  }
                  return null
                },
              },
            ],
          },
        },
      },
      server: {
        port: 3000,
        warmup: {
          clientFiles: [
            './src/app/__root.tsx',
            './src/app/_payload.tsx',
            './src/app/_payload/admin.index.tsx',
            './src/app/_payload/admin.$.tsx',
          ],
        },
      },
    },
  ),
)
