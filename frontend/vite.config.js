import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 6000,
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5000/api')
  }
})
