import { TriangleAlertIcon, XIcon } from "lucide-react"

import { Button } from "./ui/button"

interface ErrorAlertProps {
  message?: string
  onClose?(): void
}

const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-3 rounded-md bg-error/15 p-3">
      <TriangleAlertIcon className="size-5 text-error" />
      <p className="flex-1 text-error body-2">{message}</p>
      <Button
        variant="icon"
        size="icon-sm"
        className="text-error hover:bg-error/20"
        onClick={onClose}
      >
        <XIcon />
      </Button>
    </div>
  )
}

export default ErrorAlert
