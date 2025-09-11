import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory. Vercel sets these.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This correctly exposes the Vercel environment variable to your client-side code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
  }
});
