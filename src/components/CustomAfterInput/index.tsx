'use client'

import React from 'react'

export const CustomAfterInput: React.FC<{ path?: string }> = ({ path }) => {
  return (
    <div
      style={{
        padding: '0.375rem 0.625rem',
        marginTop: '0.25rem',
        borderRadius: '0.25rem',
        background: 'var(--theme-success-50, #ecfdf5)',
        border: '1px solid var(--theme-success-200, #a7f3d0)',
        fontSize: '0.6875rem',
        color: 'var(--theme-success-700, #047857)',
      }}
    >
      ⬇ <strong>AfterInput</strong> (client component) — field path: <code>{path ?? 'n/a'}</code>
    </div>
  )
}
