import { payloadPlugin } from '@payloadcms/tanstack-start/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
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
      reactPlugin: viteReact({
        exclude: [],
        include: /\.[jt]sx?$/,
      }),
      rscPlugin: rsc({ serverHandler: false }),
      tanstackStart,
    })(env),
    {
      customLogger: logger,
      resolve: {
        alias: [
          // Payload's barrel transitively pulls `prettier` (CJS) into the client
          // bundle via `configToJSONSchema` → `json-schema-to-typescript`. That
          // path is type-gen only and never runs in the browser, so stub it to
          // keep the client build from choking on prettier's `index.cjs`.
          {
            find: /^prettier$/,
            replacement: path.resolve(__dirname, 'src', 'stubs', 'prettier.ts'),
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
