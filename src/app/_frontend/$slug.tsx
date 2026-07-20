import { createFileRoute } from '@tanstack/react-router'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { getPageBySlug } from '@/functions/frontend.functions'
import { getClientSideURL } from '@/utilities/getURL'
import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

export const Route = createFileRoute('/_frontend/$slug')({
  loader: ({ params }) => getPageBySlug({ data: { slug: decodeURIComponent(params.slug) } }),
  component: DynamicPage,
})

function DynamicPage() {
  const initialData = Route.useLoaderData()
  const { slug } = Route.useParams()
  const { setHeaderTheme } = useHeaderTheme()
  const url = '/' + slug

  // Subscribe to Live Preview: when this page is rendered inside the admin's
  // Live Preview iframe, the edit view posts the in-progress form data here on
  // every change, so the preview reflects unsaved edits in real time. Outside
  // the iframe (the public site) no messages arrive and `initialData` is used.
  const { data: page } = useLivePreview<Page>({
    initialData: initialData as Page,
    serverURL: getClientSideURL(),
    depth: 2,
  })

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}
