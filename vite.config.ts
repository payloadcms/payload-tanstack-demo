import { payloadPlugin } from '@payloadcms/tanstack-start/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'

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
