Render deployment note:

- We updated the `start` script to `serve -s dist -l $PORT` to ensure Render serves the production build instead of running the Vite dev server.
- Ensure you commit the `package.json` changes and push to trigger a redeploy.

If you still see `$RefreshSig$` errors after redeploy, it means the dev server was still being run; check Render service settings and make sure Start Command is `npm start` and Build Command is `npm install && npm run build`.