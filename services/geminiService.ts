import { GoogleGenAI, Chat } from "@google/genai";

// This variable is replaced at build time by the content of VITE_GEMINI_API_KEY.
// See vite.config.ts for the configuration.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | undefined;

/**
 * Initializes and returns the GoogleGenAI instance.
 * Throws a detailed error if the API key is missing.
 */
function getAiInstance(): GoogleGenAI {
  if (ai) {
    return ai;
  }
  
  // A check to see if the environment variable was successfully injected during the build.
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("Configuration Error: The VITE_GEMINI_API_KEY is not set. Please add it to your project's Environment Variables (e.g., in Vercel) and ensure the name starts with 'VITE_'. Then, trigger a new deployment.");
  }
  
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

export function startChat(fileNames: string[], documentContent: string): Chat {
  const aiInstance = getAiInstance(); // Initialize on first use

  const fileList = fileNames.length > 0 ? fileNames.join(', ') : 'No documents uploaded';
  const systemInstruction = `You are a world-class expert specializing in analyzing and synthesizing information from multiple documents. The user has uploaded the following documents: ${fileList}.

Here is the full content of these documents:
---
${documentContent}
---

Your conversation must be strictly based on the content of these documents. When you don't have enough information from the documents, clearly state that the documents do not contain the answer. Do not use external knowledge unless the user explicitly asks you to search the web or use your general knowledge.`;

  const chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  
  return chat;
}
