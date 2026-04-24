import { createFileRoute } from '@tanstack/react-router'
import { getPageBySlug } from '@/functions/frontend.functions'
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
  const page = Route.useLoaderData()
  const { slug } = Route.useParams()
  const { setHeaderTheme } = useHeaderTheme()
  const url = '/' + slug

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
