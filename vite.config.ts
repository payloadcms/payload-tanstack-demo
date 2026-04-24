import { payloadPlugin } from '@payloadcms/tanstack-start/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const serverOnlyModules = [
  'json-schema-to-typescript',
  'dotenv',
  'dotenv-expand',
]

function stubServerOnlyModules(): Plugin {
  return {
    name: 'stub-server-only-modules',
    enforce: 'pre',
    resolveId(source, _importer, options) {
      if (options?.ssr) return null
      if (serverOnlyModules.some((mod) => source === mod || source.startsWith(mod + '/'))) {
        return { id: `\0stub:${source}`, moduleSideEffects: false }
      }
      return null
    },
    load(id) {
      if (id.startsWith('\0stub:')) {
        return 'const noop = () => {}; export default {}; export const compile = noop; export const expand = noop; export const config = noop;'
      }
      return null
    },
  }
}

function fixImportProtectionMocks(): Plugin {
  return {
    name: 'fix-import-protection-mocks',
    enforce: 'post',
    transform(_code, id) {
      if (!id.includes('\0tanstack-start-import-protection:mock-edge:')) return null

      let decoded: { exports?: string[]; runtimeId?: string } = {}
      try {
        const base64Part = id.split('mock-edge:')[1]
        decoded = JSON.parse(Buffer.from(base64Part, 'base64').toString('utf-8'))
      } catch {
        return null
      }

      const exports = decoded.exports || []
      if (!exports.includes('createRequire')) return null

      const noopProxy = `new Proxy(function(){}, { get: (_, p) => p === "then" ? undefined : () => noopProxy, apply: () => noopProxy })`
      const lines = [`const noopProxy = ${noopProxy};`]

      for (const exp of exports) {
        if (exp === 'default') {
          lines.push(`export default noopProxy;`)
        } else if (exp === 'createRequire') {
          lines.push(`export function createRequire() { return noopProxy; }`)
        } else {
          lines.push(`export const ${exp} = () => {};`)
        }
      }

      return { code: lines.join('\n'), map: null }
    },
  }
}

function fixOptimizedDepsCreateRequire(): Plugin {
  return {
    name: 'fix-optimized-deps-createRequire',
    enforce: 'post',
    transform(code, id, options) {
      if (options?.ssr) return null
      if (!id.includes('node_modules/.vite/deps/')) return null
      if (!code.includes('createRequire')) return null

      const patched = code
        .replace(
          /var import_module\s*=\s*__toESM\(require_module\(\)[^)]*\)/g,
          'var import_module = { createRequire: () => new Proxy(function(){}, { get: () => () => "", apply: () => "" }) }',
        )
        .replace(
          /var import_url\s*=\s*__toESM\(require_url\(\)[^)]*\)/g,
          'var import_url = { fileURLToPath: (u) => typeof u === "string" ? u.replace("file://", "") : "", pathToFileURL: (p) => new URL("file://" + p) }',
        )
        .replace(
          /var import_path\s*=\s*__toESM\(require_path\(\)[^)]*\)/g,
          'var import_path = { default: { resolve: (...a) => a.join("/"), join: (...a) => a.join("/"), dirname: (p) => p.replace(/\\/[^/]*$/, ""), basename: (p) => p.replace(/^.*\\//, ""), sep: "/" } }',
        )
        .replace(
          /var import_fs\s*=\s*__toESM\(require_fs\(\)[^)]*\)/g,
          'var import_fs = { default: { existsSync: () => false, readFileSync: () => "", realpathSync: Object.assign((p) => p, { native: (p) => p }) } }',
        )

      if (patched === code) return null
      return { code: patched, map: null }
    },
  }
}

export default defineConfig(
  payloadPlugin({
    additionalAliases: [
      {
        find: /^@\//,
        replacement: path.resolve(__dirname, 'src') + '/',
      },
    ],
    payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts'),
    plugins: [stubServerOnlyModules(), fixImportProtectionMocks(), fixOptimizedDepsCreateRequire()],
    scssImporters: [
      {
        findFileUrl(url: string) {
          if (url.startsWith('~@payloadcms/ui/scss')) {
            return new URL(
              'file://' +
                path.resolve(__dirname, 'node_modules/@payloadcms/ui/dist/scss/styles.scss'),
            )
          }
          return null
        },
      },
    ],
    warmupClientFiles: [
      './src/app/__root.tsx',
      './src/app/_payload.tsx',
      './src/app/_payload/admin.index.tsx',
      './src/app/_payload/admin.$.tsx',
    ],
  }),
)
