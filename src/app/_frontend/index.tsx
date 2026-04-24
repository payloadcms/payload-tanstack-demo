import { createFileRoute } from '@tanstack/react-router'
import { getPageBySlug } from '@/functions/frontend.functions'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

export const Route = createFileRoute('/_frontend/')({
  loader: () => getPageBySlug({ data: { slug: 'home' } }),
  component: HomePage,
  head: () => ({
    meta: [{ title: 'Payload Website Template' }],
  }),
})

function HomePage() {
  let page = Route.useLoaderData()
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  if (!page) {
    page = homeStatic as any
  }

  if (!page) {
    return <PayloadRedirects url="/" />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PayloadRedirects disableNotFound url="/" />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}
