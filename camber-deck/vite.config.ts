import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Make some env vars available to the client
      'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.REQUIRE_ALLOWLIST': JSON.stringify(env.REQUIRE_ALLOWLIST || 'true'),
    },
    server: {
      port: 5173,
      // Note: API routes won't work in dev mode with Vite
      // They only work when deployed to Vercel
      // For local testing, we'll use mock authentication
    }
  }
})
