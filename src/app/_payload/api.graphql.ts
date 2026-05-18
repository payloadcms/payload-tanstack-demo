import { createFileRoute } from '@tanstack/react-router'

const handler = async ({ request }: { request: Request }) => {
  const { handleGraphQL } = await import('@payloadcms/tanstack-start/server')
  const config = (await import('@payload-config')).default

  return handleGraphQL({
    config,
    request,
  })
}

export const Route = createFileRoute('/_payload/api/graphql')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
