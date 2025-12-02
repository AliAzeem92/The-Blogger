import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Direct database update
    const result = await payload.db.updateMany({
      collection: 'media',
      where: {
        cloudinaryUrl: { $exists: true, $ne: null }
      },
      data: {
        $set: {
          url: { $getField: 'cloudinaryUrl' }
        }
      }
    })
    
    return Response.json({ 
      message: `Updated ${result.modifiedCount} media records`,
      matched: result.matchedCount
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}