import { TriangleAlertIcon } from "lucide-react"

interface ErrorAlertProps {
  message?: string
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return

  return (
    <div className="flex items-center gap-x-3 rounded-md bg-error/15 p-3">
      <TriangleAlertIcon className="size-5 text-error" />
      <p className="text-error body-2">{message}</p>
    </div>
  )
}

export default ErrorAlert
