import { useEffect, useState } from "react"

import { TriangleAlertIcon, XIcon } from "lucide-react"

import { Button } from "./ui/button"

interface ErrorAlertProps {
  message?: string
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  const [isShown, setIsShown] = useState(true)

  useEffect(() => {
    if (message) {
      setIsShown(true)
    }
  }, [message])

  if (!message || !isShown) return null

  return (
    <div className="flex items-center gap-x-3 rounded-md bg-error/15 p-3">
      <TriangleAlertIcon className="size-5 text-error" />
      <p className="flex-1 text-error body-2">{message}</p>
      <Button
        variant="icon"
        size="icon-sm"
        className="text-error hover:bg-error/20"
        onClick={() => setIsShown(false)}
      >
        <XIcon />
      </Button>
    </div>
  )
}

export default ErrorAlert
