import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  src?: string
  className?: string
  fallbackClassName?: string
  onClick?(): void
}

const ChatAvatar = ({
  src,
  className,
  fallbackClassName,
  onClick,
}: ChatAvatarProps) => {
  return (
    <Avatar className={cn("", className)} onClick={onClick}>
      <AvatarImage src={src} />
      <AvatarFallback className={cn("bg-info h4", fallbackClassName)}>
        N
      </AvatarFallback>
    </Avatar>
  )
}

export default ChatAvatar
