import { ChevronDownIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import { cn } from "@/lib/utils"

interface MessageItemProps {
  classNames?: string
  name?: string
  message: string
  time: string
  type?: "private" | "group" | "channel"
  isSender?: boolean
  isForwarded?: boolean
  parentMessage?: {
    id: string
    name: string
    message: string
  }
  attachments?: []
}

const MessageItem = ({
  classNames,
  name,
  message,
  time,
  type = "private",
  isSender = false,
  isForwarded,
  parentMessage,
  attachments,
}: MessageItemProps) => {
  // TODO: check if emoji and 1 character
  const isOnlyEmoji = message.length === 2

  return (
    <div
      className={cn(
        "flex w-full",
        isSender ? "justify-end" : "justify-start",
        classNames,
      )}
    >
      <div className="flex gap-x-2">
        {type !== "private" && <ChatAvatar className="size-8" />}
        <div
          className={cn(
            "pt-1 px-2.5 pb-1.5 rounded-lg w-full max-w-[475px]",
            isSender ? "bg-bubble-2" : "bg-bubble-1",
          )}
        >
          <div className="gap-x-8 flex-center-between">
            <div className="flex items-center gap-x-1">
              {name && !isSender && type !== "private" && (
                <span className="line-clamp-1 !font-medium text-primary caption">
                  {name}
                </span>
              )}

              {isForwarded && (
                <div className="italic text-foreground/50 caption">
                  forwarded
                </div>
              )}
            </div>

            <div className="gap-x-2 flex-center-end">
              <span className="text-foreground/50 caption">{time}</span>
              <ChevronDownIcon className="size-4" />
            </div>
          </div>

          {parentMessage && (
            <div
              className={cn(
                "flex flex-col rounded-sm border-l-4 px-2 py-1 mt-1",
                isSender ? "bg-bubble-reply-2" : "bg-bubble-reply-1",
              )}
            >
              <p className="line-clamp-1 font-semibold caption">
                {parentMessage.name}
              </p>
              <p className={cn("line-clamp-1 text-foreground/50 caption")}>
                {parentMessage.message}
              </p>
            </div>
          )}

          {attachments && attachments.length > 0 && <></>}

          {/* <Image src="" /> */}

          <p className={cn("mt-1", isOnlyEmoji ? "text-[72px]" : "body-2")}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
