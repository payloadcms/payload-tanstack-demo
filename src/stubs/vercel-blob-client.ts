'use client'
// Stub for `@payloadcms/storage-vercel-blob/client`. Payload registers the Vercel
// Blob client upload handler in the import map (`importMap.js`) regardless of whether
// `clientUploads` is enabled. The real handler transitively imports `@vercel/blob/client`
// (→ `undici`) and `@payloadcms/plugin-cloud-storage/utilities` (→ node `path`), all of
// which tanstack-start's import-protection denies in the client bundle. `clientUploads`
// is disabled here, so the handler is never invoked — replace the whole module with a
// self-contained no-op, cutting the transitive chain at the source. Kept import-free so
// it resolves from `src/` (the real deps are pnpm-nested, not hoisted). Revisit if
// `clientUploads` is ever enabled.
export const VercelBlobClientUploadHandler = () => null
