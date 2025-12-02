# Cloudinary URL Not Saving - Troubleshooting Guide

## What Was Fixed

I've improved the Cloudinary upload hook with:

1. ✅ **Better Error Handling** - More detailed error messages and logging
2. ✅ **Credential Validation** - Checks if Cloudinary credentials are configured before attempting upload
3. ✅ **Enhanced Logging** - Step-by-step logging to see exactly what's happening
4. ✅ **Proper Update Options** - Added `overrideAccess: true` to ensure updates work from hooks
5. ✅ **Better Error Messages** - Clear indication of what went wrong

## How to Test

### Step 1: Verify Your Environment Variables

Make sure your `.env` file has all Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=payload-media
```

### Step 2: Restart Your Server

After updating your `.env` file or making code changes:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
pnpm dev
```

### Step 3: Upload a Test Image

1. Go to your Payload CMS admin panel: `http://localhost:3000/admin`
2. Navigate to **Media** collection
3. Click **"Create New"**
4. Upload an image
5. Fill in the **Alt** text (required)
6. Click **"Save"**

### Step 4: Check Your Server Logs

After saving, watch your terminal/console. You should see logs like:

```
🚀 Starting Cloudinary upload for: image.jpg (ID: ...)
📁 Looking for file at: D:\...\media\image.jpg
✅ File read successfully (304092 bytes)
☁️ Uploading to Cloudinary: image.jpg
✅ Upload successful! URL: https://res.cloudinary.com/...
💾 Saving Cloudinary URL to database...
✅ Successfully saved Cloudinary URL to database!
   Document ID: ...
   URL: https://res.cloudinary.com/...
   Cloudinary URL: https://res.cloudinary.com/...
   Public ID: payload-media/image_1234567890
🗑️ Deleted local file: image.jpg
```

### Step 5: Verify in Database

1. **Refresh the admin panel page** (F5 or Ctrl+R)
2. **Open the media item** you just uploaded
3. Check if the **"Cloudinary Url"** field is now filled
4. The **"url"** field should also point to Cloudinary

## Common Issues & Solutions

### Issue 1: "Cloudinary credentials not configured"

**Solution:**
- Check your `.env` file exists in the project root
- Verify all three credentials are set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Restart your dev server after adding credentials

### Issue 2: "File not ready, retrying..."

**Solution:**
- This is normal - the system waits for the file to be written to disk
- If it fails after 5 retries, check:
  - The `media/` folder exists and is writable
  - You have proper file permissions
  - Your disk isn't full

### Issue 3: "Failed to upload to Cloudinary"

**Solution:**
- Check your Cloudinary credentials are correct
- Verify your Cloudinary account is active
- Check your internet connection
- Look at the detailed error message in logs

### Issue 4: URL field is empty after upload

**Possible causes:**
1. The hook didn't run - check server logs
2. Update failed silently - check for errors in logs
3. Page needs refresh - refresh the admin panel

**Solution:**
- Check server logs for error messages
- Try uploading a new image to see if it works
- Check if the file exists in Cloudinary dashboard

## Manual Check: Verify in Cloudinary Dashboard

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Navigate to **Media Library**
3. Check the folder you specified (`payload-media` by default)
4. You should see your uploaded images there
5. Click on an image to see its URL

## Debugging Steps

### 1. Check Server Logs

Look for these log messages in order:

✅ `🚀 Starting Cloudinary upload` - Hook started
✅ `✅ File read successfully` - File was found
✅ `✅ Upload successful!` - Uploaded to Cloudinary
✅ `✅ Successfully saved Cloudinary URL` - Saved to database

If any step fails, you'll see an error message with details.

### 2. Check Database Directly

If you have MongoDB access, check the document:

```javascript
// Look for these fields in your media document:
{
  url: "https://res.cloudinary.com/...",  // Should be Cloudinary URL
  cloudinaryUrl: "https://res.cloudinary.com/...",
  cloudinaryPublicId: "payload-media/image_1234567890"
}
```

### 3. Test Cloudinary Connection

Create a simple test script:

```typescript
// test-cloudinary.ts
import { uploadToCloudinary } from './src/storage/cloudinary'
import { readFile } from 'fs/promises'

async function test() {
  const buffer = await readFile('./media/test.jpg')
  const result = await uploadToCloudinary(buffer, 'test.jpg')
  console.log('Upload successful:', result.url)
}

test().catch(console.error)
```

## Still Not Working?

If the URL is still not saving:

1. **Share your server logs** - Copy the error messages
2. **Check Cloudinary Dashboard** - See if images are uploading at all
3. **Verify environment variables** - Double-check they're loaded correctly
4. **Try a fresh upload** - Delete the old media item and upload a new one

## Expected Behavior

After a successful upload:

1. ✅ Image is uploaded to Cloudinary
2. ✅ Cloudinary URL is saved to `url` field
3. ✅ Cloudinary URL is saved to `cloudinaryUrl` field  
4. ✅ `cloudinaryPublicId` is saved
5. ✅ Local file is deleted
6. ✅ URL is visible in admin panel after refresh

