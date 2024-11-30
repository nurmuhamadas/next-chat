import { type ClassValue, clsx } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyMessage = (text: string, message?: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(message ?? "Text copied")
  })
}

export const createError = (
  message: string,
  path?: (string | number)[],
): ErrorResponse => {
  return {
    success: false,
    error: { message, path },
  }
}

export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  }
}

export const successCollectionResponse = <T>(
  data: T,
  total: number,
): ApiCollectionResponse<T> => {
  return {
    success: true,
    data,
    total,
  }
}

export const mergeName = (firstName: string, lastName?: string) => {
  return firstName + (lastName ? ` ${lastName}` : "")
}

export const generateInviteCode = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}
