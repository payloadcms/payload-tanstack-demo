'use client'

import React from 'react'

export const CustomBeforeInput: React.FC<{ path?: string }> = ({ path }) => {
  return (
    <div
      style={{
        padding: '0.375rem 0.625rem',
        marginBottom: '0.25rem',
        borderRadius: '0.25rem',
        background: 'var(--theme-warning-50, #fffbeb)',
        border: '1px solid var(--theme-warning-200, #fde68a)',
        fontSize: '0.6875rem',
        color: 'var(--theme-warning-700, #b45309)',
      }}
    >
      ⬆ <strong>BeforeInput</strong> (client component) — field path: <code>{path ?? 'n/a'}</code>
    </div>
  )
}
