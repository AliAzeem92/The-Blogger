# Cloudinary Credentials Setup Guide

## What Credentials You Need

You need **3 credentials** from Cloudinary to set up image uploads:

1. **CLOUDINARY_CLOUD_NAME** - Your Cloudinary cloud name
2. **CLOUDINARY_API_KEY** - Your API key
3. **CLOUDINARY_API_SECRET** - Your API secret key

## How to Get Your Cloudinary Credentials

### Step 1: Create a Cloudinary Account (if you don't have one)

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (no credit card required)
3. Verify your email address

### Step 2: Get Your Credentials from Dashboard

1. After logging in, you'll be taken to your **Dashboard**
2. On the Dashboard page, you'll see a section called **"Account Details"** or **"Credentials"**
3. You'll see three values displayed:

   ```
   Cloud name:    your-cloud-name-here
   API Key:       123456789012345
   API Secret:    abcdefghijklmnopqrstuvwxyz123456
   ```

### Step 3: Copy Your Credentials

Copy each of these three values exactly as shown (no spaces, no quotes).

## Example .env File

Create a `.env` file in your project root with these variables:

```env
# Payload CMS Configuration
PAYLOAD_SECRET=your-random-secret-string-here-generate-a-long-random-string
DATABASE_URI=mongodb://localhost:27017/theblogger

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key-number
CLOUDINARY_API_SECRET=your-actual-api-secret-string
CLOUDINARY_FOLDER=payload-media
```

## Real Example

Here's what it might look like with real credentials:

```env
PAYLOAD_SECRET=my-super-secret-payload-key-12345
DATABASE_URI=mongodb://localhost:27017/theblogger

CLOUDINARY_CLOUD_NAME=demo123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
CLOUDINARY_FOLDER=payload-media
```

## Important Notes

1. **Never commit your `.env` file to Git** - It contains sensitive credentials
2. **Keep your API Secret secure** - Treat it like a password
3. **CLOUDINARY_FOLDER is optional** - It defaults to `payload-media` if not set
4. **Free tier is generous** - Cloudinary's free plan includes 25GB storage and 25GB monthly bandwidth

## Quick Access to Dashboard

- Direct link to Dashboard: [https://console.cloudinary.com/settings/api-keys](https://console.cloudinary.com/settings/api-keys)

## Troubleshooting

If you can't find your credentials:
1. Make sure you're logged into Cloudinary
2. Go to Settings → Security
3. Your API Key and Cloud Name should be visible there
4. For API Secret, click "Reveal" (you may need to enter your password)

