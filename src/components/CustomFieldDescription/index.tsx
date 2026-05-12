'use client'

import React from 'react'

/**
 * Custom field Description component (client).
 *
 * In the TanStack adapter, Description components are resolved on the client
 * via `clientComponentPaths.Description` in the form state. They cannot be
 * async or import server-only modules.
 *
 * Server props like `req`, `payload` are NOT available here.
 * Only client-safe props like `field`, `path` are passed.
 */
export default function CustomFieldDescription({
  field,
  path,
}: {
  field?: { name?: string; type?: string }
  path?: string
}) {
  return (
    <div
      style={{
        marginTop: '0.5rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        background: 'var(--theme-elevation-50, #f8fafc)',
        border: '1px dashed var(--theme-elevation-200, #e2e8f0)',
        fontSize: '0.75rem',
        lineHeight: 1.5,
      }}
    >
      <strong>Custom Description</strong> (client component)
      <br />
      Field: <code>{field?.name ?? path ?? 'unknown'}</code> | Type:{' '}
      <code>{field?.type ?? 'n/a'}</code>
    </div>
  )
}
