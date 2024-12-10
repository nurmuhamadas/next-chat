import Image from "next/image"

import { DownloadIcon, EyeIcon } from "lucide-react"
import { PhotoProvider, PhotoView } from "react-photo-view"

import ChatAvatar from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn, formatMessageTime } from "@/lib/utils"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageMenu from "./message-menu"

import "react-photo-view/dist/react-photo-view.css"

interface MessageItemProps {
  classNames?: string
  message: Message
  type?: "private" | "group" | "channel"
  isSender?: boolean
  isSelected?: boolean
  timeFormat?: TimeFormat
}

const MessageItem = ({
  classNames,
  message,
  type = "private",
  isSender = false,
  isSelected = false,
  timeFormat = "12-HOUR",
}: MessageItemProps) => {
  const { isSelectMode, toggleSelectMessage } = useSelectedMessageIds()

  const isEmojiOnly = message.isEmojiOnly
  const isForwarded = !!message.originalMessageId

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
                  {message.user.name}
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

          {message.parentMessageName && message.parentMessageText && (
            <div
              className={cn(
                "flex flex-col rounded-sm border-l-4 px-2 py-1 mt-1",
                isSender ? "bg-bubble-reply-2" : "bg-bubble-reply-1",
              )}
            >
              <p className="line-clamp-1 font-semibold caption">
                {message.parentMessageName}
              </p>
              <p className={cn("line-clamp-1 text-foreground/50 caption")}>
                {message.parentMessageText}
              </p>
            </div>
          )}

          {message.attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              <PhotoProvider speed={() => 250}>
                {message.attachments.map((att) => {
                  return (
                    <div key={att.id} className="h-auto">
                      {att.type === "IMAGE" && (
                        <PhotoView src={att.url}>
                          <Image
                            src={att.url}
                            alt={att.name}
                            width={200}
                            height={150}
                            className="object-cover"
                          />
                        </PhotoView>
                      )}
                      {att.type === "AUDIO" && (
                        <audio controls src={att.url} className="w-[300px]" />
                      )}
                      {att.type === "VIDEO" && (
                        <video controls src={att.url} className="w-[300px]" />
                      )}
                      {att.type === "PDF" && (
                        <div className="group relative flex cursor-pointer flex-col gap-y-1">
                          <Image
                            src={"/images/pdf.png"}
                            alt={att.name}
                            width={75}
                            height={75}
                            className="size-full"
                          />
                          <p className="line-clamp-1 caption">{att.name}</p>
                          <div className="absolute inset-0 hidden items-center gap-x-2 bg-black/20 group-hover:flex-center">
                            <Button
                              className=""
                              variant="secondary"
                              size="icon"
                              asChild
                            >
                              <a href={att.url} target="_blank">
                                <EyeIcon />
                              </a>
                            </Button>
                            <Button
                              className=""
                              variant="secondary"
                              size="icon"
                            >
                              <a
                                href={att.downloadUrl}
                                target="_blank"
                                download
                              >
                                <DownloadIcon />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                      {att.type === "OTHER" && (
                        <div className="group relative flex cursor-pointer flex-col gap-y-1">
                          <Image
                            src={"/images/folder.png"}
                            alt={att.name}
                            width={75}
                            height={75}
                            className="size-full"
                          />
                          <p className="line-clamp-1 caption">{att.name}</p>
                          <div className="absolute inset-0 hidden items-center gap-x-2 bg-black/20 group-hover:flex-center">
                            <Button
                              className=""
                              variant="secondary"
                              size="icon"
                            >
                              <a
                                href={att.downloadUrl}
                                target="_blank"
                                download
                              >
                                <DownloadIcon />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </PhotoProvider>
            </div>
          )}

          {/* <Image src="" /> */}

          <p className={cn("mt-1", isEmojiOnly ? "text-[72px]" : "body-2")}>
            {message.message}
          </p>

          <div className="mt-1.5 flex-center-between">
            <div className="">{/* Reaction here */}</div>
            <span className="ml-auto text-foreground/50 caption">
              {formatMessageTime(message.createdAt, timeFormat)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
