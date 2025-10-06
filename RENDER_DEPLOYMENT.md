# Frontend Deployment Instructions for Render

## Option 1: Deploy as Static Site (Recommended)

1. **In Render Dashboard:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Choose the repository: `FounderCRM`

2. **Configuration:**
   - **Name:** `foundercrm-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://foundercrm-backend.onrender.com/api/v1
   ```

4. **Redirects (for SPA routing):**
   - Create a `_redirects` file in `public` folder (already created)
   - Content: `/*    /index.html   200`

## Option 2: Using render.yaml

If you want to use the render.yaml file instead:

1. **Delete the current web service** on Render that's failing
2. **Create a new Static Site** using the same repository
3. **Use the configuration above**

## Why the Current Deployment is Failing

The error shows Render is trying to run `npm run dev` (development server) instead of serving the built files. This happens when:

1. Render detects a `package.json` and assumes it's a Node.js web service
2. The service type is set to "web" instead of "static site"
3. The build artifacts aren't being served correctly

## Quick Fix

**Delete the current service and create a new Static Site with the configuration above.**

The build is working perfectly (you can see "Build successful 🎉"), but the deployment type is wrong.