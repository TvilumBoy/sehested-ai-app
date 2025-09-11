import * as pdfjsLib from 'pdfjs-dist';

// Use a static, version-pinned CDN URL for the worker to ensure stability.
// The dynamic '?url' import is not compatible with all environments.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@5.4.149/build/pdf.worker.mjs`;

/**
 * Extracts text content from a PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves to the extracted text content as a string.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Loading a PDF document.
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // A more robust way to join text items, handling potential undefined strings.
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
};
