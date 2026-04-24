import { createFileRoute } from '@tanstack/react-router'
import { getPostBySlug } from '@/functions/frontend.functions'
import { PostHero } from '@/heros/PostHero'
import RichText from '@/components/RichText'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

export const Route = createFileRoute('/_frontend/posts/$slug')({
  loader: ({ params }) => getPostBySlug({ data: { slug: decodeURIComponent(params.slug) } }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  const { slug } = Route.useParams()
  const { setHeaderTheme } = useHeaderTheme()
  const url = '/posts/' + slug

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pt-16 pb-16">
      <PayloadRedirects disableNotFound url={url} />
      <PostHero post={post} />
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}
