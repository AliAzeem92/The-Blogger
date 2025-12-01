import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

type BlogPostPageParams = {
  slug?: string | string[]
}

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

type LexicalRoot = {
  root?: LexicalNode
}

// Very small helper to turn Payload Lexical JSON into plain text paragraphs
function extractTextFromLexical(node?: LexicalNode | LexicalNode[] | null): string {
  if (!node) return ''

  let text = ''

  if (Array.isArray(node)) {
    for (const child of node) {
      text += extractTextFromLexical(child)
    }
    return text
  }

  if (Array.isArray(node.children)) {
    text += extractTextFromLexical(node.children)
  }

  if (node.text) {
    text += node.text
  }

  // Add a line break at the end of paragraphs so they render as separate blocks
  if (node.type === 'paragraph') {
    text += '\n\n'
  }

  return text
}

export default async function BlogPostPage({ params }: { params: Promise<BlogPostPageParams> }) {
  const resolvedParams = await params
  const slugValue = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug

  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slugValue } }, { status: { equals: 'published' } }],
    },
    depth: 2,
  })

  const post = posts.docs[0]
  if (!post) notFound()

  const lexicalData = post.content as LexicalRoot | undefined
  const contentText = extractTextFromLexical(lexicalData?.root).trim()

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {post.featuredImage && typeof post.featuredImage === 'object' && (
        <div className="mb-8">
          <Image
            src={post.featuredImage.url || ''}
            alt={post.featuredImage.alt || ''}
            width={1200}
            height={400}
            className="object-cover rounded-lg w-full h-64"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
      )}

      <header className="mb-4">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span>By {typeof post.author === 'object' ? post.author.name : 'Unknown'}</span>
          {post.publishedAt && (
            <time>{new Date(post.publishedAt as string).toLocaleDateString()}</time>
          )}
          {post.category && typeof post.category === 'object' && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {post.category.name}
            </span>
          )}
        </div>

        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag: { id: string | number; name?: string } | string) => (
              <span
                key={typeof tag === 'object' ? tag.id : tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                # {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none whitespace-pre-wrap bg-[#252525] hover:bg-[#2A2A2A] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1] p-4 rounded-lg">
        {contentText || 'No content available.'}
      </div>
    </article>
  )
}
