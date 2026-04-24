import type React from 'react'

interface Props {
  disableNotFound?: boolean
  url: string
}

export const PayloadRedirects: React.FC<Props> = ({ disableNotFound, url }) => {
  if (disableNotFound) return null

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">This page could not be found.</p>
      </div>
    </div>
  )
}
