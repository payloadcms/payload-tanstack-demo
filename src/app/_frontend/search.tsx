import { createFileRoute } from '@tanstack/react-router'
import { searchPosts } from '@/functions/frontend.functions'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Search } from '@/search/Component'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

type SearchParams = { q?: string }

export const Route = createFileRoute('/_frontend/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: (search.q as string) || undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ deps }) => searchPosts({ data: { query: deps.q } }),
  component: SearchPage,
  head: () => ({
    meta: [{ title: 'Payload Website Template Search' }],
  }),
})

function SearchPage() {
  const posts = Route.useLoaderData()
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as any[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}
