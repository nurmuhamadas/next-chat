import Link from "next/link"

import { PinIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn, formatChatTime } from "@/lib/utils"

import ChatAvatar from "../../../components/chat-avatar"

import RoomListItemMenu from "./room-list-item-menu"

interface RoomListItemProps {
  selected?: boolean
  timeFormat?: TimeFormat
  data: Room
  locale: "en" | "id"
}

const RoomListItem = ({
  selected = false,
  data,
  timeFormat = "12-HOUR",
  locale,
}: RoomListItemProps) => {
  return (
    <Link href={`/${data.type}/${data.actionId}`}>
      <li
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-1.5 pl-3 hover:bg-grey-4 group",
          selected && "bg-primary text-white hover:bg-primary",
        )}
      >
        <ChatAvatar
          className="size-12"
          src={data.imageUrl ?? ""}
          name={data.name}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-x-3">
            <h4 className="flex-1 truncate h5">{data.name}</h4>
            <div className="gap-x-1.5 flex-center-end">
              {data.lastMessage?.time && (
                <span className="caption">
                  {formatChatTime(data.lastMessage?.time, timeFormat, locale)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <p
              className={cn(
                "flex-1 truncate text-muted-foreground body-2",
                selected && "text-grey-4",
              )}
            >
              {data.type !== "chat" && data.lastMessage && (
                <span className="font-semibold text-white">
                  {data.lastMessage?.sender}:{" "}
                </span>
              )}
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

        <RoomListItemMenu room={data} />
      </li>
    </Link>
  )
}

export default RoomListItem
