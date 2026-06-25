import { createServerFn } from '@tanstack/react-start'

export const getHeaderData = createServerFn({ method: 'GET' }).handler(async () => {
  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })
  return await payload.findGlobal({ slug: 'header', depth: 1 })
})

export const getFooterData = createServerFn({ method: 'GET' }).handler(async () => {
  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })
  return await payload.findGlobal({ slug: 'footer', depth: 1 })
})

export const getPageBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1,
      pagination: false,
      overrideAccess: false,
      where: { slug: { equals: data.slug } },
    })

    return result.docs?.[0] || null
  })

export const getPosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { page?: number }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    return await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      page: data.page || 1,
      overrideAccess: false,
      select: { title: true, slug: true, categories: true, meta: true },
    })
  })

export const getPostBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: data.slug } },
    })

    return result.docs?.[0] || null
  })

export const getArchivePosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { categories?: (string | number)[]; limit?: number }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    return await payload.find({
      collection: 'posts',
      depth: 1,
      limit: data.limit || 3,
      ...(data.categories && data.categories.length > 0
        ? { where: { categories: { in: data.categories } } }
        : {}),
    })
  })

export const searchPosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { query?: string }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    return await payload.find({
      collection: 'search',
      depth: 1,
      limit: 12,
      select: { title: true, slug: true, categories: true, meta: true },
      pagination: false,
      ...(data.query
        ? {
            where: {
              or: [
                { title: { like: data.query } },
                { 'meta.description': { like: data.query } },
                { 'meta.title': { like: data.query } },
                { slug: { like: data.query } },
              ],
            },
          }
        : {}),
    })
  })
