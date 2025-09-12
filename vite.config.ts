import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      // Expose the API key to the client-side code.
      // Vite will replace `process.env.API_KEY` with the value of `VITE_GEMINI_API_KEY`
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    }
  };
});
