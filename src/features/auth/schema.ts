import { z } from "zod"

import { ERROR } from "@/constants/error"

export const signInSchema = z.object({
  email: z.string().email(ERROR.INVALID_EMAIL).min(1, ERROR.EMAIL_REQUIRED),
  password: z.string().min(1, ERROR.PASSWORD_REQUIRED),
})

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(1, ERROR.EMAIL_REQUIRED)
      .max(256, ERROR.EMAIL_TOO_LONG),
    password: z
      .string()
      .min(1, ERROR.PASSWORD_REQUIRED)
      .min(8, { message: ERROR.PASSWORD_TOO_SHORT })
      .max(256, { message: ERROR.PASSWORD_TOO_LONG })
      .regex(/[a-z]/, {
        message: ERROR.PASSWORD_CONTAIN_LOWERCASE,
      })
      .regex(/[A-Z]/, {
        message: ERROR.PASSWORD_CONTAIN_UPPERCASE,
      })
      .regex(/\d/, { message: ERROR.PASSWORD_CONTAIN_NUMBER }),
    confirmPassword: z.string().min(1, ERROR.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR.PASSWORD_DONT_MATCH,
    path: ["confirmPassword"],
  })

export const forgotPassworsSchema = z.object({
  email: z.string().email().min(1, ERROR.EMAIL_REQUIRED),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, ERROR.PASSWORD_REQUIRED)
      .min(8, { message: ERROR.PASSWORD_TOO_SHORT })
      .max(256, { message: ERROR.PASSWORD_TOO_LONG })
      .regex(/[a-z]/, {
        message: ERROR.PASSWORD_CONTAIN_LOWERCASE,
      })
      .regex(/[A-Z]/, {
        message: ERROR.PASSWORD_CONTAIN_UPPERCASE,
      })
      .regex(/\d/, { message: ERROR.PASSWORD_CONTAIN_NUMBER }),
    confirmPassword: z.string().min(1, ERROR.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR.PASSWORD_DONT_MATCH,
    path: ["confirmPassword"],
  })

export const otpSchema = z.object({
  code: z.string().min(1, ERROR.OTP_REQUIRED).max(6),
})
