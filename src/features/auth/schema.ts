import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email().min(1, "Required"),
  password: z.string().min(1, "Required"),
})

export const signUpSchema = z
  .object({
    email: z.string().email().min(1, "Required"),
    password: z
      .string()
      .min(1, "Required")
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const forgotPassworsSchema = z.object({
  email: z.string().email().min(1, "Required"),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Required")
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
