import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/now-playing': 'http://localhost:5000',
      '/playlist': 'http://localhost:5000',
    },
  },
})
