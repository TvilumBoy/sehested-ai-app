import { GoogleGenAI, Chat } from "@google/genai";

// FIX: Aligned API client initialization with the coding guidelines.
// Directly use `process.env.API_KEY` and remove unnecessary checks and fallbacks,
// as the guidelines state to assume the API key is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
