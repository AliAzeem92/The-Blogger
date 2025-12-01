import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PostCard } from '@/components/PostCard'

import type { Post } from '@/payload-types'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const recentPosts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 1,
    depth: 2,
  })

  return (
    <div className="container mx-auto py-8">
      <section className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to The Blogger</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing stories, insights, and ideas from our community of writers.
        </p>
        <Link
          href="/blog"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Read More Blogs
        </Link>
      </section>

      {recentPosts.docs.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Recent Blog</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {recentPosts.docs.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                slug={post.slug as string}
                title={post.title as string}
                excerpt={post.excerpt as string | null | undefined}
                author={post.author as Post['author']}
                featuredImage={
                  typeof post.featuredImage === 'object' && post.featuredImage !== null
                    ? ({
                        url: (post.featuredImage as unknown as { url: string }).url,
                        alt: (post.featuredImage as unknown as { alt?: string | null }).alt,
                      } as {
                        url: string
                        alt?: string | null
                      })
                    : null
                }
                publishedAt={post.publishedAt as Post['publishedAt']}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
