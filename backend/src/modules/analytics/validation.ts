import { z } from 'zod';

export const validateMonthlyAnalysis = {
  query: z.object({
    year: z.string().regex(/^\d{4}$/),
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/),
  }),
};

export const validateAddRevenue = {
  body: z.object({
    name: z.string().min(1),
    amount: z.number().min(0),
    date: z.string().datetime(),
    sourceType: z.string().optional(),
  }),
};

export const validateAddExpense = {
  body: z.object({
    name: z.string().min(1),
    amount: z.number().min(0),
    date: z.string().datetime(),
  }),
};

export const validatePreviewReport = {
  body: z.object({
    periodFrom: z.string().datetime(),
    periodTo: z.string().datetime(),
    sections: z.array(z.string()),
  }),
};

export const validateSaveReport = {
  body: z.object({
    periodFrom: z.string().datetime(),
    periodTo: z.string().datetime(),
    reportType: z.string().min(1),
  }),
};
