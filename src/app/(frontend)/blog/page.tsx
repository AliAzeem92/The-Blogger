import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

type FeaturedImage = {
  url: string
  alt?: string | null
}

const toFeaturedImage = (image: unknown): FeaturedImage | null => {
  if (
    image &&
    typeof image === 'object' &&
    'url' in image &&
    typeof (image as { url?: unknown }).url === 'string'
  ) {
    return {
      url: (image as { url: string }).url,
      alt: (image as { alt?: string | null }).alt,
    }
  }
  return null
}

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
            featuredImage={toFeaturedImage(post.featuredImage)}
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
