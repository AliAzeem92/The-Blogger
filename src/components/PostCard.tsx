import Link from 'next/link'
import Image from 'next/image'

type FeaturedImage = {
  url: string
  alt?: string | null
}

type Author = {
  name?: string | null
}

type PostCardProps = {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  author?: Author | string | null
  featuredImage?: FeaturedImage | null
  publishedAt?: string | Date | null
}

const hasFeaturedImage = (image: unknown): image is FeaturedImage =>
  typeof image === 'object' &&
  image !== null &&
  'url' in image &&
  typeof (image as { url?: unknown }).url === 'string'

export function PostCard({
  slug,
  title,
  excerpt,
  author,
  featuredImage,
  publishedAt,
}: PostCardProps) {
  const authorName = typeof author === 'object' && author !== null ? author.name : author

  return (
    <Link href={`/blog/${slug}`} target="_blank">
      <article
        className="border border-black hover:border-white rounded-lg p-6 shadow-sm hover:shadow-2xl
                 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02]"
      >
        {hasFeaturedImage(featuredImage) && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt ?? title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        <h3 className="text-xl font-semibold mb-2">{title}</h3>

        {excerpt && <p className="text-gray-600 mb-4">{excerpt}</p>}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {authorName || 'Unknown'}</span>
          {publishedAt && <time>{new Date(publishedAt).toLocaleDateString()}</time>}
        </div>
      </article>
    </Link>
  )
}
