import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    resolvedPosts?: Post[]
  }
> = (props) => {
  const { id, introContent, populateBy, selectedDocs, resolvedPosts } = props

  let posts: Post[] = resolvedPosts || []

  if (populateBy !== 'collection' && selectedDocs?.length) {
    posts = selectedDocs.map((post) => {
      if (typeof post.value === 'object') return post.value
      return undefined
    }).filter(Boolean) as Post[]
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
