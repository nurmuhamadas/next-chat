import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  className?: string
  onClick?(): void
}

const ChatAvatar = ({ className, onClick }: ChatAvatarProps) => {
  return (
    <Avatar className={cn("", className)} onClick={onClick}>
      <AvatarImage src="" />
      <AvatarFallback className="bg-info h4">N</AvatarFallback>
    </Avatar>
  )
}

export default ChatAvatar
