import type { ServerFunctionClient, ServerFunctionClientArgs } from 'payload'

import { createServerFn } from '@tanstack/react-start'

type LoadInput = {
  _splat?: string
  search?: Record<string, string | string[]>
}

// The app-owned config + generated importMap are resolved *inside* each handler
// so the TanStack Start compiler strips them (and their `@payload-config` /
// `./importMap.js` server-only graph: `payload`, `@payloadcms/db-sqlite`, etc.)
// out of the client bundle.

export const loadAdminPageRSC = createServerFn({ method: 'GET' })
  .inputValidator((data: LoadInput): LoadInput => data ?? {})
  .handler(async ({ data }) => {
    const { loadAdminPage } = await import('@payloadcms/tanstack-start/server')
    const config = await (await import('@payload-config')).default
    const { importMap } = await import('../importMap.js')
    return loadAdminPage({
      config,
      importMap,
      search: data.search,
      splat: data._splat,
    })
  })

export const getLayoutDataFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { loadLayoutData } = await import('@payloadcms/tanstack-start/layouts')
  const config = await (await import('@payload-config')).default
  const { importMap } = await import('../importMap.js')
  return loadLayoutData({ config, importMap })
})

const runPayloadServerFn = createServerFn({ method: 'POST' })
  .inputValidator((args: ServerFunctionClientArgs): ServerFunctionClientArgs => args)
  .handler(async ({ data }) => {
    const { handleServerFunctions } = await import('@payloadcms/tanstack-start/server')
    const config = await (await import('@payload-config')).default
    const { importMap } = await import('../importMap.js')
    return (await handleServerFunctions({
      args: data.args,
      config,
      importMap,
      name: data.name,
    })) as any
  })

/**
 * Client-side `ServerFunctionClient` wired into `RootProvider.serverFunction`.
 *
 * This is the inlined equivalent of the package's `createServerFunctionClient`
 * (from `@payloadcms/tanstack-start`). We intentionally do NOT import it from
 * the package: that main entry barrel also re-exports `payloadApiRoute`, whose
 * dynamic `handleAPIRoute` import drags `handleEndpoints` (server-only) into the
 * client bundle — where `payload` resolves to its browser shim and the build
 * fails with a MISSING_EXPORT. The package ships no `sideEffects: false`, so the
 * unused `payloadApiRoute` graph can't be tree-shaken out. Inlining keeps the
 * client graph off the main barrel entirely.
 *
 * `stripUnserializable` removes functions / symbols / RegExps / React elements
 * before dispatch: TanStack Start's seroval wire format errors on them (the old
 * `fetch + JSON.stringify` pipeline silently dropped them), so we sanitize here
 * to keep existing callers (e.g. `getFormState`, which may pass live form state)
 * working without each call site sanitizing.
 */
export const serverFunctionHandler: ServerFunctionClient = async (
  args: ServerFunctionClientArgs,
) => {
  const safeArgs = stripUnserializable(args) as ServerFunctionClientArgs
  return (await runPayloadServerFn({ data: safeArgs })) as ReturnType<ServerFunctionClient>
}

function stripUnserializable(
  value: unknown,
  cache: WeakMap<object, unknown> = new WeakMap(),
  ancestors: WeakSet<object> = new WeakSet(),
): unknown {
  if (value === null || value === undefined) {
    return value
  }

  const t = typeof value
  if (t === 'function' || t === 'symbol') {
    return undefined
  }
  if (t !== 'object') {
    return value
  }

  const obj = value as Record<string, unknown>

  if (typeof obj.$$typeof === 'symbol') {
    return undefined
  }

  if (ancestors.has(obj)) {
    return undefined
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  if (obj instanceof Date) {
    // Normalize to a plain `Date`. Subclasses (e.g. `@date-fns/tz`'s `TZDate`,
    // used by the schedule-publish drawer) are `instanceof Date` but have a
    // different `constructor`, which TanStack Start's seroval serializer
    // rejects with "The value [object Date] ... cannot be parsed/serialized".
    return new Date(obj.getTime())
  }

  if (obj instanceof RegExp) {
    return undefined
  }

  ancestors.add(obj)

  if (obj instanceof Map) {
    const cleaned = new Map()
    cache.set(obj, cleaned)
    for (const [k, v] of obj) {
      const cv = stripUnserializable(v, cache, ancestors)
      if (cv !== undefined) {
        cleaned.set(k, cv)
      }
    }
    ancestors.delete(obj)
    return cleaned
  }

  if (obj instanceof Set) {
    const cleaned = new Set()
    cache.set(obj, cleaned)
    for (const v of obj) {
      const cv = stripUnserializable(v, cache, ancestors)
      if (cv !== undefined) {
        cleaned.add(cv)
      }
    }
    ancestors.delete(obj)
    return cleaned
  }

  if (Array.isArray(obj)) {
    const arr: unknown[] = []
    cache.set(obj, arr)
    for (const item of obj) {
      arr.push(stripUnserializable(item, cache, ancestors))
    }
    ancestors.delete(obj)
    return arr
  }

  if (ArrayBuffer.isView(obj)) {
    ancestors.delete(obj)
    return obj
  }

  const result: Record<string, unknown> = {}
  cache.set(obj, result)
  for (const key of Object.keys(obj)) {
    const v = stripUnserializable(obj[key], cache, ancestors)
    if (v !== undefined) {
      result[key] = v
    }
  }
  ancestors.delete(obj)
  return result
}
