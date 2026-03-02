# GitHub OAuth Setup Guide for CheckBeforeCommit

## Issue: "Continue with GitHub" Button Not Working

If clicking the "Continue with GitHub" button doesn't do anything, you need to configure GitHub OAuth in your Appwrite console.

## Steps to Fix:

### 1. **Go to Appwrite Console**
   - Navigate to https://cloud.appwrite.io
   - Select your project: `CheckBeforeCommit`

### 2. **Configure GitHub OAuth**
   - Go to **Settings** → **OAuth Providers** (or **Auth** → **OAuth**)
   - Find **GitHub** in the list of providers
   - Click on GitHub to expand settings

### 3. **Add GitHub Credentials**
   - **Client ID**: `Ov23li8b5rJqq52jkgN6`
   - **Client Secret**: `3b6c3b9e08558e42d3e4c2a1166e7c280a2fc5d9`
   - Click **Save** or **Update**

### 4. **Configure Redirect URLs in Appwrite**
   - In GitHub OAuth settings, you may need to add redirect URIs:
     - `http://localhost:3000/auth/github-callback` (for development)
     - `https://yourdomain.com/auth/github-callback` (for production - replace with your actual domain)

### 5. **Verify Environment Variables**
   Make sure `.env.local` contains:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23li8b5rJqq52jkgN6
   GITHUB_OAUTH_CLIENT_SECRET=3b6c3b9e08558e42d3e4c2a1166e7c280a2fc5d9
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 6. **GitHub OAuth App Settings (Alternative - if needed)**
   - If the above doesn't work, check GitHub OAuth app settings:
   - Go to https://github.com/settings/developers
   - Find your OAuth app for this project
   - **Authorization callback URL** should be: `http://localhost:3000/auth/github-callback`
   - Save changes

## How It Works:

1. User clicks **"Continue with GitHub"** button
2. Redirected to GitHub login page (via Appwrite)
3. After authentication, GitHub redirects back to `/auth/github-callback`
4. User session is created and user is sent to `/dashboard`

## Testing:

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click **"Continue with GitHub"**
4. Should redirect to GitHub
5. After login, should redirect back to your dashboard

## Troubleshooting:

### Still not working?

1. **Check Appwrite Logs**: In Appwrite console, check the Activity/Logs section
2. **Check Browser Console**: Look for JavaScript errors
3. **Verify Project ID**: Make sure `NEXT_PUBLIC_APPWRITE_PROJECT_ID` matches your project
4. **Verify Endpoint**: Make sure `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct (https://nyc.cloud.appwrite.io/v1)
5. **Clear Cookies**: Clear browser cookies and try again

### Error: "Failed to redirect to GitHub OAuth"

This typically means:
- GitHub provider is not enabled in Appwrite
- Credentials are incorrect
- Appwrite API is unreachable

### Solution: Enable GitHub in Appwrite

1. Open Appwrite console
2. Go to your project settings
3. Find **OAuth Providers** or **Authentication**
4. Enable GitHub provider
5. Add the Client ID and Secret
6. Save

After completing these steps, the "Continue with GitHub" button should work properly!
