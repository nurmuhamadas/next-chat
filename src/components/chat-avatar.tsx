import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  className?: string
  fallbackClassName?: string
  onClick?(): void
}

const ChatAvatar = ({
  className,
  fallbackClassName,
  onClick,
}: ChatAvatarProps) => {
  return (
    <Avatar className={cn("", className)} onClick={onClick}>
      <AvatarImage src="" />
      <AvatarFallback className={cn("bg-info h4", fallbackClassName)}>
        N
      </AvatarFallback>
    </Avatar>
  )
}

export default ChatAvatar
