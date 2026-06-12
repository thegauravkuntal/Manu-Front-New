import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Remove console.log in production
        drop_debugger: true,     // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      output: {
        comments: false,          // Remove comments
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react', 'react-icons'],
        },
      },
    },
    target: 'es2015',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})