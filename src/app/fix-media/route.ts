import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    const media = await payload.find({
      collection: 'media',
      where: {
        cloudinaryUrl: { exists: true }
      }
    })
    
    let updated = 0
    
    for (const doc of media.docs) {
      if (doc.cloudinaryUrl) {
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            url: doc.cloudinaryUrl
          },
          overrideAccess: true
        })
        updated++
      }
    }
    
    return Response.json({ 
      message: `Updated ${updated} media records`,
      total: media.docs.length 
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}