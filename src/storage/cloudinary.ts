import { v2 as cloudinary } from 'cloudinary'

// Validate Cloudinary environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    '⚠️  Cloudinary credentials not found in environment variables. Image uploads to Cloudinary will fail.',
  )
  console.warn('   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file')
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName || '',
  api_key: apiKey || '',
  api_secret: apiSecret || '',
  secure: true,
})

// Cloudinary upload handler for PayloadCMS
export const uploadToCloudinary = async (
  file: File | Buffer,
  filename: string,
): Promise<{
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}> => {
  try {
    // Convert File to buffer if needed
    let fileBuffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
    } else {
      fileBuffer = file
    }

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now()
    const sanitizedFilename = filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars with underscore
      .toLowerCase()
    const uniquePublicId = `${sanitizedFilename}_${timestamp}`

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || 'payload-media',
          resource_type: 'auto',
          public_id: uniquePublicId,
          overwrite: false, // Don't overwrite existing files
          invalidate: true, // Invalidate CDN cache
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          if (!result) {
            reject(new Error('Upload failed: No result from Cloudinary'))
            return
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          })
        },
      )

      uploadStream.end(fileBuffer)
    })
  } catch (error) {
    throw new Error(
      `Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error(
      `Failed to delete from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
