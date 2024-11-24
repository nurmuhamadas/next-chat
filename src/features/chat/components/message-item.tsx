import ChatAvatar from "@/components/chat-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageMenu from "./message-menu"

interface MessageItemProps {
  classNames?: string
  message: Message
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
  isSelected?: boolean
}

const MessageItem = ({
  classNames,
  message,
  time,
  type = "private",
  isSender = false,
  isForwarded,
  parentMessage,
  attachments,
  isSelected = false,
}: MessageItemProps) => {
  const { isSelectMode, toggleSelectMessage } = useSelectedMessageIds()

  // TODO: check if emoji and 1 character
  const isOnlyEmoji = message.message.length === 2

  return (
    <div
      className={cn(
        "flex w-full  rounded-md",
        isSender ? "justify-end" : "justify-start",
        isSelectMode && "hover:bg-black/10",
        classNames,
      )}
      onClick={() => {
        if (isSelectMode) {
          toggleSelectMessage(message.id)
        }
      }}
    >
      {isSelectMode && (
        <div className={cn("pt-4 pl-2", isSender ? "mr-auto" : "mr-4")}>
          <Checkbox checked={isSelected} />
        </div>
      )}

      <div className="flex gap-x-2">
        {type !== "private" && <ChatAvatar className="size-8" />}
        <div
          className={cn(
            "pt-1 px-2.5 pb-1 rounded-lg w-full max-w-[475px]",
            isSender ? "bg-bubble-2" : "bg-bubble-1",
          )}
        >
          <div className="gap-x-8 flex-center-between">
            <div className="flex items-center gap-x-1">
              {!isSender && type !== "private" && (
                <span className="line-clamp-1 !font-medium text-primary caption">
                  {message.name}
                </span>
              )}

              {isForwarded && (
                <div className="italic text-foreground/50 caption">
                  forwarded
                </div>
              )}
            </div>

            <div className="gap-x-2 flex-center-end">
              <MessageMenu isSender={isSender} message={message} />
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
            {message.message}
          </p>

          <div className="mt-1.5 flex-center-between">
            <div className="">{/* Reaction here */}</div>
            <span className="ml-auto text-foreground/50 caption">{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
