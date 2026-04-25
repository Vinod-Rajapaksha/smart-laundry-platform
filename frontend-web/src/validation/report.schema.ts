import { z } from "zod";

export const reportSchema = z.object({
  reportType: z.string().min(1, "Report type is required"),
  periodFrom: z.string().min(1, "Start date is required"),
  periodTo: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.periodFrom) <= new Date(data.periodTo), {
  message: "End date must be after start date",
  path: ["periodTo"],
});

export type ReportInput = z.infer<typeof reportSchema>;
