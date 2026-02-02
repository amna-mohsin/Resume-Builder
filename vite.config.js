import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Check this line

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Check this line
  ],
})