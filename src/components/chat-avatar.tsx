import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  src?: string
  name?: string
  className?: string
  fallbackClassName?: string
  onClick?(): void
}

const ChatAvatar = ({
  src,
  name,
  className,
  fallbackClassName,
  onClick,
}: ChatAvatarProps) => {
  return (
    <Avatar className={cn("", className)} onClick={onClick}>
      <AvatarImage src={src} />
      <AvatarFallback className={cn("bg-info h4", fallbackClassName)}>
        {name?.charAt(0)?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default ChatAvatar
