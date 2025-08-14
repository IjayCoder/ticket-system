import { z } from "zod";

export const profileSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),

    fullName: z
      .string()
      .min(3, { message: "fullName must be at least 3 characters long" })
      .max(30, { message: "fullName must be at most 30 characters long" })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: "Only letters,space, numbers, and underscores are allowed",
      }),
  })
  .strict();
