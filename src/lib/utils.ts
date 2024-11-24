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
