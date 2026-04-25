import { createWorker } from 'tesseract.js';
import logger from '../config/logger.js';

export interface OCRResult {
  text: string;
  confidence: number;
  isMatch: boolean;
  extractedAmount?: number;
  extractedDate?: string;
  extractedRef?: string;
  extractedBank?: string;
  extractedAccount?: string;
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

    let extractedAmount: number | undefined;
    let extractedDate: string | undefined;
    let extractedRef: string | undefined;
    let extractedBank: string | undefined;
    let extractedAccount: string | undefined;

    // Amount Extraction
    const amountRegex = /(?:RS|LKR|AMT|AMOUNT|TOTAL)[:.\s]*([\d,]+\.\d{2})/i;
    const amountMatch = text.match(amountRegex);
    if (amountMatch) {
      extractedAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Date Extraction
    const dateRegex = /(\d{2}[-/]\d{2}[-/]\d{4}|\d{2}\s+(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{4})/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      extractedDate = dateMatch[0];
    }

    // Reference ID Extraction
    const refRegex = new RegExp(`(${expectedRef.substring(0, 4)}\\d+|REF[:.\\s]*([A-Z0-9]{6,}))`, 'i');
    const refMatch = text.match(refRegex);
    if (refMatch) {
      extractedRef = refMatch[0].replace(/REF[:.\s]*/i, '');
    }

    // 4. Bank Name Extraction (Common Sri Lankan Banks)
    const bankPatterns = [
      /COMMERCIAL\s*BANK/i, /SAMPATH\s*BANK/i, /HNB/i, /HATTON\s*NATIONAL/i,
      /BOC/i, /BANK\s*OF\s*CEYLON/i, /PEOPLE[']?S\s*BANK/i, /NSB/i, /NATIONAL\s*SAVINGS/i,
      /NTB/i, /NATIONS\s*TRUST/i, /SEYLAN/i, /NDB/i
    ];
    
    for (const pattern of bankPatterns) {
      const bankMatch = text.match(pattern);
      if (bankMatch) {
        extractedBank = bankMatch[0].toUpperCase();
        break;
      }
    }

    // 5. Account Number Extraction (Generic pattern for bank accounts)
    const accRegex = /(?:ACC|ACCOUNT|ACC\s*NO)[:.\s]*(\d{8,16})/i;
    const accMatch = text.match(accRegex);
    if (accMatch) {
      extractedAccount = accMatch[1];
    }

    return {
      text: text.trim(),
      confidence,
      isMatch,
      extractedAmount,
      extractedDate,
      extractedRef,
      extractedBank,
      extractedAccount
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
