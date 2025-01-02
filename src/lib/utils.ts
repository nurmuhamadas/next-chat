import { RoomType as RoomTypeModel } from "@prisma/client"
import { type ClassValue, clsx } from "clsx"
import {
  format,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns"
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
  data: T[],
  total: number,
  cursor?: string,
): ApiCollectionResponse<T> => {
  return {
    success: true,
    data,
    total,
    cursor,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timer
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export const formatMessageTime = (time: string, timeFormat: TimeFormat) => {
  const date = parseISO(time)

  return format(date, timeFormat === "12-HOUR" ? "hh:mm a" : "HH:mm")
}

import { enUS, id } from "date-fns/locale"

export const formatChatTime = (
  time: string,
  timeFormat: TimeFormat,
  locale: "en" | "id" = "en",
) => {
  const date = parseISO(time)
  const localeObj = locale === "en" ? enUS : id

  if (isToday(date)) {
    return format(date, timeFormat === "12-HOUR" ? "hh:mm a" : "HH:mm", {
      locale: localeObj,
    })
  } else if (isYesterday(date)) {
    return locale === "en" ? "Yesterday" : "Kemarin"
  } else if (isThisWeek(date)) {
    return format(date, "EEE", { locale: localeObj })
  } else if (isThisYear(date)) {
    return format(date, "MMM d", { locale: localeObj })
  } else {
    return format(date, "MMM d, yyyy", { locale: localeObj })
  }
}

export const roomTypeToRoomTypeModel = (type: RoomType): RoomTypeModel => {
  if (type === "chat") return "PRIVATE"
  if (type === "group") return "GROUP"
  return "CHANNEL"
}

export const roomTypeToRoomTypeModelLower = (
  type: RoomType,
): RoomTypeModelLower => {
  if (type === "chat") return "private"
  if (type === "group") return "group"
  return "channel"
}

export const roomTypeModelToRoomType = (type: RoomTypeModel): RoomType => {
  if (type === "PRIVATE") return "chat"
  if (type === "GROUP") return "group"
  return "channel"
}
