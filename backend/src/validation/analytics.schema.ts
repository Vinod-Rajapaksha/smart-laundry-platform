import { z } from "zod";

export const analyticsQuerySchema = z.object({
  from: z.string().datetime("Valid start date is required").optional(),
  to: z.string().datetime("Valid end date is required").optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).default("day"),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
