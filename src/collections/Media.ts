import type { CollectionConfig } from 'payload'
import { uploadToCloudinary, deleteFromCloudinary } from '@/storage/cloudinary'
import { unlink } from 'fs/promises'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize'],
    listSearchableFields: ['alt', 'filename'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'This field is automatically filled after the image is uploaded to Cloudinary. This is the CDN URL where your image is hosted.',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    // Images will be temporarily stored locally, then uploaded to Cloudinary
    // Local files are deleted after successful Cloudinary upload
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.file && !data.cloudinaryPublicId) {
          try {
            const result = await uploadToCloudinary(req.file.data, req.file.name)

            data.url = result.url
            data.cloudinaryUrl = result.url
            data.cloudinaryPublicId = result.publicId
            data.width = result.width
            data.height = result.height

            req.payload.logger.info(`Cloudinary upload successful: ${result.url}`)
          } catch (error) {
            req.payload.logger.error(`Cloudinary upload failed: ${error}`)
          }
        }
        return data
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Delete from Cloudinary when media is deleted
        if (doc.cloudinaryPublicId) {
          try {
            await deleteFromCloudinary(doc.cloudinaryPublicId as string)
            req.payload.logger.info(
              `Successfully deleted ${doc.cloudinaryPublicId} from Cloudinary`,
            )
          } catch (error) {
            req.payload.logger.error(`Failed to delete from Cloudinary: ${error}`)
          }
        }

        // Also delete local file if it still exists
        if (doc.filename) {
          try {
            const filePath = path.join(process.cwd(), 'media', doc.filename as string)
            await unlink(filePath)
          } catch (_error) {
            // File might not exist, which is fine
          }
        }
      },
    ],
  },
}
