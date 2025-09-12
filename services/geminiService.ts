import { GoogleGenAI, Chat } from "@google/genai";

// The API key is injected by Vite's `define` feature in `vite.config.ts`.
// It replaces `process.env.API_KEY` with the value of `GEMINI_API_KEY`
// from your environment during the build process.
const apiKey = process.env.API_KEY;

// A runtime check to ensure the API key is available. If the environment
// variable is not set during the build, Vite replaces it with `undefined`,
// which JSON.stringify turns into the string "undefined".
if (!apiKey || apiKey === "undefined") {
  throw new Error("API key not found. Please ensure that the GEMINI_API_KEY environment variable is set correctly in Vercel and that the project has been redeployed.");
}

const ai = new GoogleGenAI({ apiKey });

export function startChat(fileNames: string[], documentContent: string): Chat {
  const fileList = fileNames.length > 0 ? fileNames.join(', ') : 'No documents uploaded';
  const systemInstruction = `You are a world-class expert specializing in analyzing and synthesizing information from multiple documents. The user has uploaded the following documents: ${fileList}.

Here is the full content of these documents:
---
${documentContent}
---

Your conversation must be strictly based on the content of these documents. When you don't have enough information from the documents, clearly state that the documents do not contain the answer. Do not use external knowledge unless the user explicitly asks you to search the web or use your general knowledge.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  
  return chat;
}
