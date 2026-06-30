'use client'
import type { ReactNode } from 'react'
// Stub for `@payloadcms/storage-vercel-blob/client`. Payload registers the Vercel
// Blob client upload handler in the import map and renders it as a wrapper around the
// admin tree. The real handler transitively imports `@vercel/blob/client`, which pulls
// `undici` + `async-retry`'s browser-incompatible `require()` into the client bundle —
// crashing the admin and tripping tanstack-start's import-protection at build time.
// `clientUploads` is disabled here, so the handler never registers an uploader; all it
// must do is render its children through (the real component returns `<>{children}</>`).
// Returning `null` instead — as a naive stub would — unmounts the entire admin subtree
// and yields a blank page. Kept import-free so it resolves from `src/` (the real deps
// are pnpm-nested, not hoisted). Revisit if `clientUploads` is ever enabled.
export const VercelBlobClientUploadHandler = ({ children }: { children?: ReactNode }) =>
  children ?? null
