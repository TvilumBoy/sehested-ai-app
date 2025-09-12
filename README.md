<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18a75utyryQHHaIkMs9_93RCOo8xdda2m

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a file named `.env.local` in the root of your project. Add your Gemini API key to this file.
   
   The variable name **must** be `VITE_GEMINI_API_KEY`.

   Your `.env.local` file should look like this:
   ```
   VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
   When deploying to a platform like Vercel, remember to set the environment variable there with the same name: `VITE_GEMINI_API_KEY`.

3. **IMPORTANT: Secure Your API Key**

   **Why `VITE_`?** The Vite build tool requires this prefix for security reasons to expose variables to the browser. Vercel may show a warning about exposing this key, which is expected. The next step—securing your API key in the Google Console—is how you properly protect it.

   This application uses the Gemini API directly from the user's browser. This means your API key will be visible in the public-facing code. To protect your key from unauthorized use, you **must** add restrictions to it in your Google AI Platform Console.
   
   - Go to your API key settings in the [Google AI Platform Console](https://aistudio.google.com/app/apikey).
   - Under "Website restrictions", add your Vercel domain (e.g., `your-app-name.vercel.app`) and your local development URL (e.g. `localhost:5173`).
   - This ensures your key can only be used from your approved websites.

4. Run the app:
   `npm run dev`
