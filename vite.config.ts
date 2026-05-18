import { payloadPlugin } from '@payloadcms/tanstack-start/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLogger, defineConfig, mergeConfig, type PluginOption } from 'vite'

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

/**
 * Loads pre-compiled CSS files from @payloadcms packages as runtime <style>
 * injections, bypassing Vite's CSS pipeline (and Tailwind's postcss plugin,
 * which misparses Payload's `@layer` wrapping).
 *
 * The previous implementation simply emptied these files, but each component
 * ships its own CSS (e.g. `ModularDashboard/index.css`) that's not bundled
 * into `app.scss`, so the dashboard layout and other component styles broke.
 */
function loadPayloadDistCssAsStyle(): PluginOption {
  const VIRT_PREFIX = '\0payload-dist-css:'
  // Trailing `.js` keeps Vite's built-in CSS plugin (which matches paths
  // ending in .css/.less/.scss/etc.) from re-claiming our virtual module.
  const VIRT_SUFFIX = '.payload-dist-css.js'
  return {
    name: 'load-payload-dist-css-as-style',
    enforce: 'pre',
    resolveId(id, importer) {
      if (
        importer &&
        importer.includes('@payloadcms') &&
        importer.includes('/dist/') &&
        /\.(?:css|less)$/.test(id) &&
        !id.includes('.scss')
      ) {
        const resolvedPath = path.resolve(path.dirname(importer), id)
        return VIRT_PREFIX + resolvedPath + VIRT_SUFFIX
      }
    },
    load(id) {
      if (!id.startsWith(VIRT_PREFIX) || !id.endsWith(VIRT_SUFFIX)) return
      const filePath = id.slice(VIRT_PREFIX.length, id.length - VIRT_SUFFIX.length)
      let css = ''
      try {
        css = fs.readFileSync(filePath, 'utf8')
      } catch {
        return 'export default ""'
      }
      const json = JSON.stringify(css)
      return `
const css = ${json};
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.setAttribute('data-payload-dist-css', ${JSON.stringify(filePath)});
  style.textContent = css;
  document.head.appendChild(style);
}
export default css;
`
    },
  }
}

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
        exclude: [/node_modules\/@payloadcms\/ui\/dist/],
        include: /\.[jt]sx?$/,
      }),
      rscPlugin: rsc({ serverHandler: false }),
      tanstackStart,
    })(env),
    {
      customLogger: logger,
      plugins: [loadPayloadDistCssAsStyle()],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'payload-admin': [
                '@payloadcms/ui',
                '@payloadcms/tanstack-start',
                '@payloadcms/richtext-lexical',
              ],
              'code-highlight': ['prism-react-renderer'],
            },
          },
        },
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
