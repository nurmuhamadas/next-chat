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
      .email(ERROR.INVALID_EMAIL)
      .min(1, ERROR.EMAIL_REQUIRED)
      .max(100, ERROR.EMAIL_TOO_LONG),
    username: z
      .string({ required_error: ERROR.USERNAME_REQUIRED })
      .min(1, ERROR.USERNAME_REQUIRED)
      .min(3, ERROR.USERNAME_TOO_SHORT)
      .max(100, ERROR.USERNAME_TOO_LONG)
      .regex(/^[a-zA-Z0-9._-]+$/, ERROR.INVALID_USERNAME_FORMAT),
    password: z
      .string()
      .min(1, ERROR.PASSWORD_REQUIRED)
      .min(8, { message: ERROR.PASSWORD_TOO_SHORT })
      .max(100, { message: ERROR.PASSWORD_TOO_LONG })
      .regex(/[a-z]/, {
        message: ERROR.PASSWORD_SHOULD_CONTAIN_LOWERCASE,
      })
      .regex(/[A-Z]/, {
        message: ERROR.PASSWORD_SHOULD_CONTAIN_UPPERCASE,
      })
      .regex(/\d/, { message: ERROR.PASSWORD_SHOULD_CONTAIN_NUMBER }),
    confirmPassword: z.string().min(1, ERROR.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR.PASSWORD_DONT_MATCH,
    path: ["confirmPassword"],
  })

export const emailVerificationSchema = z.object({
  email: z.string().email(ERROR.INVALID_EMAIL).min(1, ERROR.EMAIL_REQUIRED),
})

export const verifyEmailSchema = z.object({
  email: z.string().email(ERROR.INVALID_EMAIL).min(1, ERROR.EMAIL_REQUIRED),
  token: z.string().min(1, ERROR.TOKEN_REQUIRED),
})

export const emailLoginSchema = z.object({
  email: z.string().email(ERROR.INVALID_EMAIL).min(1, ERROR.EMAIL_REQUIRED),
})

export const signInEmailSchema = z.object({
  email: z.string().email(ERROR.INVALID_EMAIL).min(1, ERROR.EMAIL_REQUIRED),
  token: z.string().min(1, ERROR.TOKEN_REQUIRED),
})

export const emailPasswordResetSchema = z.object({
  email: z.string().email().min(1, ERROR.EMAIL_REQUIRED),
})

export const passwordResetSchema = z
  .object({
    email: z.string().email().min(1, ERROR.EMAIL_REQUIRED),
    token: z.string().min(1, ERROR.TOKEN_REQUIRED),
    password: z
      .string()
      .min(1, ERROR.PASSWORD_REQUIRED)
      .min(8, { message: ERROR.PASSWORD_TOO_SHORT })
      .max(100, { message: ERROR.PASSWORD_TOO_LONG })
      .regex(/[a-z]/, {
        message: ERROR.PASSWORD_SHOULD_CONTAIN_LOWERCASE,
      })
      .regex(/[A-Z]/, {
        message: ERROR.PASSWORD_SHOULD_CONTAIN_UPPERCASE,
      })
      .regex(/\d/, { message: ERROR.PASSWORD_SHOULD_CONTAIN_NUMBER }),
    confirmPassword: z.string().min(1, ERROR.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR.PASSWORD_DONT_MATCH,
    path: ["confirmPassword"],
  })

export const otpSchema = z.object({
  code: z.string().min(1, ERROR.OTP_REQUIRED).max(6),
})
