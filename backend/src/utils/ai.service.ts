import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateReviewSummary = async (reviews: string[]): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Skipping AI summary.');
      return '';
    }

    if (reviews.length === 0) return '';

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
      You are a premium branding assistant for "B & W Laundry", a high-end smart laundry service.
      Below is a list of customer reviews. Summarize them into a single, punchy, and professional "Community Verdict" 
      that is exactly 2 sentences long. 
      Focus on what customers love most (e.g., speed, care, convenience).
      Keep the tone futuristic, clean, and extremely positive.
      
      Reviews:
      ${reviews.map((r, i) => `${i + 1}. "${r}"`).join('\n')}
      
      Verdict:
    `;

    console.log('[AI] Starting summary generation with gemini-pro...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    console.log('[AI] Summary generated successfully.');
    return text;
  } catch (error: any) {
    console.error('[AI] Generation failed:', {
      status: error.status,
      message: error.message,
      stack: error.stack?.split('\n')[1]
    });
    return '';
  }
};
