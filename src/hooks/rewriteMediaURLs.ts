import type { CollectionAfterReadHook } from 'payload'

const API_FILE_PREFIX = '/api/media/file/'
const STATIC_PREFIX = '/media/'

const toStaticURL = (url: unknown): unknown =>
  typeof url === 'string' && url.startsWith(API_FILE_PREFIX)
    ? url.replace(API_FILE_PREFIX, STATIC_PREFIX)
    : url

export const rewriteMediaURLs: CollectionAfterReadHook = ({ doc }) => {
  if (!doc || typeof doc !== 'object') return doc

  doc.url = toStaticURL(doc.url)
  doc.thumbnailURL = toStaticURL(doc.thumbnailURL)

  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const size of Object.values(doc.sizes as Record<string, { url?: unknown }>)) {
      if (size && typeof size === 'object') {
        size.url = toStaticURL(size.url)
      }
    }
  }

  return doc
}
