import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required (e.g. Home, Office)"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
