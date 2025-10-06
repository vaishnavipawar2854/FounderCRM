import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    // Enable React fast-refresh only during development to avoid $RefreshSig$ in production bundles
    react({
      fastRefresh: !isProduction,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    // Allow render host(s) explicitly to avoid blocked host errors in production
    // You can add more hosts here as needed
    allowedHosts: [
      'foundercrm-de91.onrender.com',
      'foundercrm-de91.onrender.com:5173',
      'localhost',
      '127.0.0.1',
      'host.docker.internal'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: [
      'foundercrm-de91.onrender.com',
      'foundercrm-de91.onrender.com:4173',
      'localhost',
      '127.0.0.1',
      'host.docker.internal'
    ]
  }
})
