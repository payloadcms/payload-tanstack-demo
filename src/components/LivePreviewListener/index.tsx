'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from '@tanstack/react-router'
import React, { useCallback } from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const refresh = useCallback(() => {
    router.invalidate()
  }, [router])
  return <PayloadLivePreview refresh={refresh} serverURL={getClientSideURL()} />
}
