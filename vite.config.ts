import { withPayload } from '@payloadcms/tanstack-start/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(
  withPayload({
    payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts'),
    // Everything app-specific is layered on via the single `vite` override —
    // `withPayload` merges it on top of the Payload defaults (arrays append,
    // objects deep-merge). The React, RSC, and TanStack Start plugins, the
    // `~@payloadcms/ui/scss` importer, the client-side `prettier` stub, and
    // sourcemap-warning silencing are all handled by `withPayload` itself.
    vite: {
      plugins: [nitro()],
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
          // Project `@/` → `src/` alias.
          {
            find: /^@\//,
            replacement: path.resolve(__dirname, 'src') + '/',
          },
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
  }),
)
