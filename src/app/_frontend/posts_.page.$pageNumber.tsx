import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPosts } from '@/functions/frontend.functions'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

export const Route = createFileRoute('/_frontend/posts_/page/$pageNumber')({
  loader: async ({ params }) => {
    const pageNum = Number(params.pageNumber)
    if (!Number.isInteger(pageNum)) throw notFound()
    return getPosts({ data: { page: pageNum } })
  },
  component: PostsPaginatedPage,
  head: ({ params }) => ({
    meta: [{ title: `Payload Website Template Posts Page ${params.pageNumber || ''}` }],
  }),
})

function PostsPaginatedPage() {
  const posts = Route.useLoaderData()
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}
