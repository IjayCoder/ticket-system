import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    fullName: z
      .string()
      .min(3, { message: "fullName must be at least 3 characters long" })
      .max(30, { message: "fullName must be at most 30 characters long" })
      .regex(/^[@a-zA-Z0-9_ ]+$/, {
        message: "Only letters,space, numbers, and underscores are allowed",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      })
      .max(64, { message: "Password must be at most 64 characters long" }),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .strict();
