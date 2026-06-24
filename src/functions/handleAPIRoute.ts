import { handleEndpoints } from 'payload'

// Local copy of the adapter's `handleAPIRoute`. Imported dynamically from the
// `/_payload/api/$` route's server handler so it tree-shakes out of the client
// bundle. Importing the package's `@payloadcms/tanstack-start/server` version
// instead drags its `handleEndpoints` (server-only) `payload` import into the
// client graph, where `payload` resolves to its browser shim and the build
// fails with a `handleEndpoints` MISSING_EXPORT.
export async function handleAPIRoute(request: Request): Promise<Response> {
  const config = (await import('@payload-config')).default

  const url = new URL(request.url)
  const slugParts = url.pathname
    .replace(/^\/api\/?/, '')
    .split('/')
    .filter(Boolean)
  const path = slugParts.length ? `/api/${slugParts.join('/')}` : '/api'

  return handleEndpoints({
    config,
    path,
    request,
  })
}
