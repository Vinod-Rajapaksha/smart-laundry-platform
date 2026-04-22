import { z } from "zod";
import { ANALYTICS_DATE_RANGES } from "../core/constants.js";

export const analyticsQuerySchema = z.object({
  range: z.enum(Object.values(ANALYTICS_DATE_RANGES) as [string, ...string[]]).default(ANALYTICS_DATE_RANGES.TODAY),
});

export const monthlyAnalysisSchema = z.object({
  year: z.string().regex(/^\d{4}$/),
  month: z.string().regex(/^(0?[1-9]|1[0-2])$/),
});

export const addRevenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().datetime("Valid date is required"),
  sourceType: z.string().optional(),
});

export const addExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().datetime("Valid date is required"),
});

export const previewReportSchema = z.object({
  periodFrom: z.string().datetime("Valid start date is required"),
  periodTo: z.string().datetime("Valid end date is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
});

export const saveReportSchema = z.object({
  periodFrom: z.string().datetime("Valid start date is required"),
  periodTo: z.string().datetime("Valid end date is required"),
  reportType: z.string().min(1, "Report type is required"),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type MonthlyAnalysisInput = z.infer<typeof monthlyAnalysisSchema>;
export type AddRevenueInput = z.infer<typeof addRevenueSchema>;
export type AddExpenseInput = z.infer<typeof addExpenseSchema>;
export type PreviewReportInput = z.infer<typeof previewReportSchema>;
export type SaveReportInput = z.infer<typeof saveReportSchema>;
