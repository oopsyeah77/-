
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true, // Allow access from local network
      port: 3000
    },
    base: './', // Ensure relative paths for file system loading
    build: {
      outDir: 'dist', // Standard output directory for Capacitor
      emptyOutDir: true
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env safely including NODE_ENV to avoid React crashes
      'process.env': JSON.stringify({ ...env, NODE_ENV: mode })
    }
  }
})
