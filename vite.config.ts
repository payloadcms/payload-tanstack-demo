import { withPayload } from '@payloadcms/tanstack-start/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(
  withPayload({
    payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts'),
    vite: {
      plugins: [nitro()],
      resolve: {
        alias: [
          // Project `@/` → `src/` alias.
          {
            find: /^@\//,
            replacement: path.resolve(__dirname, 'src') + '/',
          },
          {
            find: /^tslib$/,
            replacement: path.resolve(__dirname, 'node_modules', 'tslib', 'tslib.es6.mjs'),
          },
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
