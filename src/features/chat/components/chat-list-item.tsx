import { CheckCheckIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatListItemProps {
  selected?: boolean
}

const ChatListItem = ({ selected = false }: ChatListItemProps) => {
  return (
    <li
      className={cn(
        "flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4",
        selected && "bg-primary text-white hover:bg-primary",
      )}
    >
      <Avatar className="size-[54px]">
        <AvatarImage src="" />
        <AvatarFallback className="bg-info h4">N</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-x-3">
          <h4 className="flex-1 truncate h5">User Name</h4>
          <div className="gap-x-1.5 flex-center-end">
            <CheckCheckIcon className="size-4 text-grey-2" />
            <span className="caption">17:12</span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <p
            className={cn(
              "flex-1 truncate text-grey-3 body-1",
              selected && "text-grey-4",
            )}
          >
            Latest message will be shown here
          </p>
          <Badge
            className={cn("rounded-full", selected && "bg-white text-primary")}
          >
            12
          </Badge>
        </div>
      </div>
    </li>
  )
}

export default ChatListItem
