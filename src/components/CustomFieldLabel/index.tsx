'use client'

import React from 'react'

type Props = {
  label?: Record<string, string> | string
  path?: string
  required?: boolean
}

export const CustomFieldLabel: React.FC<Props> = ({ label, path, required }) => {
  const labelText = typeof label === 'string' ? label : label?.en || path || 'Field'

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        fontSize: '0.875rem',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--theme-success-500, #34d399)',
        }}
      />
      {labelText}
      {required && <span style={{ color: 'var(--theme-error-500, #ef4444)' }}>*</span>}
      <span
        style={{
          fontSize: '0.625rem',
          padding: '0.125rem 0.375rem',
          borderRadius: '0.25rem',
          background: 'var(--theme-elevation-100)',
          color: 'var(--theme-elevation-600)',
        }}
      >
        custom label
      </span>
    </label>
  )
}
