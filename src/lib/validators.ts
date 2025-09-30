import { z } from "zod";
export const habitSchema = z.object({
  name: z.string().min(2, { message: "Habit name must be at least 2 characters." }),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "Please select a valid color." }),
  frequency: z.discriminatedUnion("type", [
    z.object({ type: z.literal("daily") }),
    z.object({
      type: z.literal("weekly_days"),
      days: z.array(z.number().min(0).max(6)).min(1, "Please select at least one day."),
    }),
    z.object({
      type: z.literal("weekly_target"),
      count: z.coerce.number().min(1, "Target must be at least 1.").max(7, "Target cannot exceed 7."),
    }),
    z.object({
      type: z.literal("monthly_target"),
      count: z.coerce.number().min(1, "Target must be at least 1.").max(31, "Target cannot exceed 31."),
    }),
  ]),
  goal: z.object({
    unit: z.string().min(1, "Unit is required.").optional(),
    target: z.coerce.number().min(1, "Target must be at least 1.").optional(),
    timeframe: z.enum(["weekly", "monthly"]).optional(),
  }).optional(),
});
export type HabitFormData = z.infer<typeof habitSchema>;
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});
export type LoginFormData = z.infer<typeof loginSchema>;
export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});
export type RegisterFormData = z.infer<typeof registerSchema>;