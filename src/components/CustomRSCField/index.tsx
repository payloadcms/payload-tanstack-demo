'use client'

import type { TextFieldClient } from 'payload'

import React from 'react'

/**
 * Custom Field component (client).
 *
 * IMPORTANT: In the TanStack Start adapter, field components are resolved
 * on the CLIENT via the import map — NOT rendered as RSCs on the server.
 *
 * The flow:
 * 1. Server builds formState with `clientFieldComponentPath` = string ref
 * 2. `toSerializableFormState()` strips `customComponents` (pre-rendered nodes)
 * 3. Client receives the path string, resolves from importMap.js, renders it
 *
 * This means:
 * - You CANNOT use `async` function components here
 * - You CANNOT import server-only modules (payload, node:fs, etc.)
 * - You DO receive `clientField`, `path`, `value`, `data` as props
 * - You do NOT receive `req`, `payload`, or other server-only props
 *
 * For server-side data fetching in field components, use the `serverProps`
 * pattern with a `renderComponent` call from a server function, or use
 * `renderPayloadComponentOnServer` for on-demand RSC rendering.
 */
export default function CustomRSCField({
  clientField,
  data,
  field,
  path,
  value,
}: {
  clientField?: TextFieldClient
  data?: Record<string, unknown>
  field?: { name?: string; type?: string }
  path?: string
  value?: unknown
}) {
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '2px solid var(--theme-elevation-200, #e2e8f0)',
        background: 'var(--theme-elevation-50, #f8fafc)',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--theme-elevation-500, #64748b)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#8b5cf6',
          }}
        />
        Custom Field Component (client-rendered)
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{field?.name ?? path}</strong>
        {clientField?.required && (
          <span style={{ color: 'var(--theme-error-500)', marginLeft: '0.25rem' }}>*</span>
        )}
      </div>
      <div
        style={{
          padding: '0.5rem 0.75rem',
          background: 'white',
          borderRadius: '0.25rem',
          border: '1px solid var(--theme-elevation-150, #e2e8f0)',
          fontSize: '0.875rem',
          minHeight: '2rem',
        }}
      >
        {value ? String(value) : <em style={{ color: '#94a3b8' }}>No value set</em>}
      </div>
      <div
        style={{
          marginTop: '0.375rem',
          fontSize: '0.6875rem',
          color: 'var(--theme-elevation-400, #94a3b8)',
        }}
      >
        Characters: {charCount} | Document title:{' '}
        {(data?.title as string) || 'untitled'} | Type: {field?.type ?? 'text'}
      </div>
    </div>
  )
}
