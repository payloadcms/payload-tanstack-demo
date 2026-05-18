/**
 * Simple tag-based revalidation for TanStack Start.
 *
 * In Next.js, `revalidateTag` / `revalidatePath` purge the ISR cache.
 * TanStack Start has no built-in ISR, so we use a global revision map:
 *
 * - Payload hooks call `revalidateTag('pages')` or `revalidatePath('/posts/slug')`
 *   to bump a revision counter.
 * - Route loaders include `getRevision('pages')` in their `gcTime` / cache key
 *   so TanStack Router knows when to refetch.
 *
 * This works for single-process deployments. For multi-process or edge
 * deployments, replace this with a shared store (Redis, KV, etc.).
 */

const revisions = new Map<string, number>()

export function revalidateTag(tag: string): void {
  revisions.set(tag, (revisions.get(tag) ?? 0) + 1)
}

export function revalidatePath(path: string): void {
  revalidateTag(`path:${path}`)
}

export function getRevision(tag: string): number {
  return revisions.get(tag) ?? 0
}

export function getPathRevision(path: string): number {
  return getRevision(`path:${path}`)
}
