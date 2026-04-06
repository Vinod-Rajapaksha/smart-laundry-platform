import { z } from "zod";

export const machineStatus = ["AVAILABLE", "BUSY", "MAINTENANCE", "OUT_OF_ORDER"] as const;
export const machineTypes = ["WASHER", "DRYER"] as const;

export const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(machineTypes),
  status: z.enum(machineStatus).default("AVAILABLE"),
  capacity: z.number().positive("Capacity must be positive").optional(),
});

export type MachineInput = z.infer<typeof machineSchema>;
