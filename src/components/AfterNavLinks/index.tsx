'use client'

import React from 'react'

const AfterNavLinks: React.FC = () => {
  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        margin: '0.5rem 1rem',
        borderRadius: '0.5rem',
        background: 'var(--theme-elevation-100)',
        border: '1px solid var(--theme-elevation-200)',
        fontSize: '0.75rem',
      }}
    >
      <strong>Custom Nav Link (Client)</strong>
      <br />
      Injected via <code>afterNavLinks</code>
    </div>
  )
}

export default AfterNavLinks
