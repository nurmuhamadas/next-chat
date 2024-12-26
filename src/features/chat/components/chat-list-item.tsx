import Link from "next/link"

import { PinIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn, formatChatTime } from "@/lib/utils"

import ChatAvatar from "../../../components/chat-avatar"

import ChatListItemMenu from "./chat-list-item-menu"

interface ChatListItemProps {
  selected?: boolean
  timeFormat?: TimeFormat
  data: Room
}

const ChatListItem = ({
  selected = false,
  data,
  timeFormat = "12-HOUR",
}: ChatListItemProps) => {
  return (
    <Link href={`/${data.type}/${data.id}`}>
      <li
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-1.5 pl-3 hover:bg-grey-4 group",
          selected && "bg-primary text-white hover:bg-primary",
        )}
      >
        <ChatAvatar
          className="size-[54px]"
          src={data.imageUrl ?? ""}
          name={data.name}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-x-3">
            <h4 className="flex-1 truncate h5">{data.name}</h4>
            <div className="gap-x-1.5 flex-center-end">
              {data.lastMessage?.time && (
                <span className="caption">
                  {formatChatTime(data.lastMessage?.time, timeFormat)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <p
              className={cn(
                "flex-1 truncate text-muted-foreground body-1",
                selected && "text-grey-4",
              )}
            >
              {data.lastMessage?.message}
            </p>
            {data.totalUnreadMessages > 0 && (
              <Badge
                className={cn(
                  "rounded-full",
                  selected && "bg-white text-primary",
                )}
              >
                {data.totalUnreadMessages}
              </Badge>
            )}
            {data.pinned && (
              <PinIcon className="size-3 text-muted-foreground" />
            )}
          </div>
        </div>

        <ChatListItemMenu room={data} />
      </li>
    </Link>
  )
}

export default ChatListItem
