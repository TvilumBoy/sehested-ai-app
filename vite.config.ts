import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This makes the GEMINI_API_KEY environment variable, which is set in Vercel
    // or a local .env file, available as process.env.API_KEY in the client-side code.
    // Vite's build process replaces this with the actual value at build time.
    // JSON.stringify is needed to correctly wrap the value as a string.
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
});
