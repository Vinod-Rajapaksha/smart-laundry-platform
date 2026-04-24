import { createWorker } from 'tesseract.js';
import logger from '../config/logger.js';

export interface OCRResult {
  text: string;
  confidence: number;
  isMatch: boolean;
}

export const processSlipOCR = async (
  imageBuffer: Buffer,
  expectedRef: string
): Promise<OCRResult> => {
  let worker;
  try {
    worker = await createWorker('eng');
    
    const { data: { text, confidence } } = await worker.recognize(imageBuffer);
    const cleanText = text.replace(/\s+/g, '').toUpperCase();
    const cleanRef = expectedRef.replace(/\s+/g, '').toUpperCase();
    
    const isMatch = cleanText.includes(cleanRef) || cleanRef.includes(cleanText);

    return {
      text: text.trim(),
      confidence,
      isMatch,
    };
  } catch (error) {
    logger.error('OCR processing failed:', error);
    return {
      text: '',
      confidence: 0,
      isMatch: false,
    };
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};
