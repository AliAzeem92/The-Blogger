import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

import type { Post } from '@/payload-types'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    depth: 2,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blogs</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.docs.map((post) => (
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
                    url: (post.featuredImage as any).url,
                    alt: (post.featuredImage as any).alt,
                  } as {
                    url: string
                    alt?: string | null
                  })
                : null
            }
            publishedAt={post.publishedAt as Post['publishedAt']}
          />
        ))}

        {posts.docs.length === 0 && (
          <p className="text-gray-600">
            More bolgs will appear here as soon as they are published.
          </p>
        )}
      </div>
    </div>
  )
}
