'use client'

import React from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'

const AfterDashboard: React.FC = () => {
  return (
    <Banner type="info">
      <h4>Custom Components Test — After Dashboard (Client)</h4>
      <p style={{ marginTop: '0.5rem' }}>
        This <code>afterDashboard</code> component is a <strong>client component</strong> registered
        via <code>admin.components.afterDashboard</code> in <code>payload.config.ts</code>.
        If you see this, TanStack Start correctly resolves client components from the import map.
      </p>
    </Banner>
  )
}

export default AfterDashboard
