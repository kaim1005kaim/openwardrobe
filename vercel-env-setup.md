# Vercel Environment Variables Setup

## Required Environment Variables for Gallery Feature

Add the following environment variable to your Vercel project:

### NEXT_PUBLIC_GOOGLE_API_KEY
- **Value**: `[YOUR_GOOGLE_API_KEY_HERE]` (Contact project admin for the actual key)
- **Environments**: Production, Preview, Development

## Setup Steps

1. Go to https://vercel.com/dashboard
2. Select your `openwardrobe-opendesign` project
3. Navigate to Settings → Environment Variables
4. Add the environment variable above
5. Redeploy the project

## API Key Requirements

This Google API key needs the following permissions:
- Google Drive API (read-only access)
- Access to public folders

The key is already configured for the project's domain restrictions.