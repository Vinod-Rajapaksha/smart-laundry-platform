import { z } from "zod";
import { loginSchema as sharedLoginSchema } from "../../../validation/auth.schema";

export const loginSchema = sharedLoginSchema;

export type LoginFormValues = z.infer<typeof loginSchema>;