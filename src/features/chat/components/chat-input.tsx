"use client"

import { ChangeEventHandler, useRef, useState } from "react"

import { format } from "date-fns"
import {
  ImageIcon,
  Loader2Icon,
  PaperclipIcon,
  PencilIcon,
  SendHorizonalIcon,
  SmileIcon,
  XIcon,
} from "lucide-react"

import EmojiPopover from "@/components/emoji-popover"
import { Button } from "@/components/ui/button"
import useSendMessage from "@/features/messages/hooks/api/use-send-message"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn } from "@/lib/utils"

import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"

import AudioRecorder from "./audio-recorder"
import InputFilePreview from "./input-file-preview"
import TextEditor from "./text-editor"

interface ChatInputProps {
  editedMessage?: {
    id: string
    name: string
    message: string
  }
  repliedMessage?: {
    id: string
    name: string
    message: string
  }
}

const ChatInput = ({ repliedMessage, editedMessage }: ChatInputProps) => {
  const type = useRoomType()
  const id = useRoomId()

  const inputImageRef = useRef<HTMLInputElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { cancelReplyMessage } = useRepliedMessageId()
  const { cancelEditMessage } = useEditedMessageId()

  const [message, setMessage] = useState("")
  const [isEmojiOnly, setIsEmojiOnly] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | undefined>()
  const [attachments, setAttachments] = useState<File[]>([])

  const audioUrl = recordedAudio
    ? URL.createObjectURL(recordedAudio)
    : undefined

  const { mutate: sendMessage, isPending: isSending } = useSendMessage()

  const handleSend = () => {
    const att = [...attachments]
    if (recordedAudio) {
      const audioName = `recorded_audio-${format(new Date(), "yyyy-MM-dd_HH:mm:ss")}`
      att.push(new File([recordedAudio], audioName, { type: "audio/webm" }))
    }

    const roomIds: Record<string, string | undefined> = {}
    if (type === "chat") roomIds["userId"] = id
    if (type === "channel") roomIds["groupId"] = id
    if (type === "group") roomIds["channelId"] = id

    sendMessage(
      {
        form: {
          ...roomIds,
          attachments: att,
          message,
          isEmojiOnly: String(isEmojiOnly),
        },
      },
      {
        onSuccess() {
          setMessage("")
          setAttachments([])
          setIsEmojiOnly(false)
          setRecordedAudio(undefined)
        },
      },
    )
  }

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setAttachments((prevAttachments) => [...prevAttachments, ...filesArray])
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="flex w-full justify-center p-4 pt-3">
      <div className="flex w-full max-w-[700px] items-end gap-x-2">
        <div className="flex flex-1 flex-col rounded-xl bg-surface p-3">
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, i) => {
                return (
                  <InputFilePreview
                    key={file.size + file.name}
                    file={file}
                    disabled={isSending}
                    onRemove={() => handleRemoveFile(i)}
                  />
                )
              })}
            </div>
          )}
          {audioUrl && (
            <div className="relative mb-3 flex h-max w-full flex-col overflow-hidden rounded-md bg-grey-4 p-1.5">
              <audio controls src={audioUrl} className="w-full" />
              <Button
                variant="icon"
                size="icon-sm"
                className="absolute right-0 top-0 size-6  bg-foreground/50 hover:bg-foreground"
                onClick={() => setRecordedAudio(undefined)}
              >
                <XIcon className="!size-3.5 text-surface" />
              </Button>
            </div>
          )}
          {editedMessage && (
            <div className={cn("mb-3 flex items-center gap-x-1")}>
              <PencilIcon className="mr-2 size-6 text-muted-foreground" />
              <div className="flex flex-1 flex-col rounded-sm border-l-4 bg-bubble-reply-1 py-1 pl-2 pr-1">
                <p className="line-clamp-1 font-semibold caption">
                  Edit message
                </p>
                <p className={cn("line-clamp-1 text-foreground/50 caption")}>
                  {editedMessage.message}
                </p>
              </div>

              <Button variant="icon" size="icon-sm" onClick={cancelEditMessage}>
                <XIcon className="" />
              </Button>
            </div>
          )}
          {!editedMessage && repliedMessage && (
            <div className={cn("mb-3 flex items-center gap-x-1")}>
              <div className="flex flex-1 flex-col rounded-sm border-l-4 bg-bubble-reply-1 py-1 pl-2 pr-1">
                <p className="line-clamp-1 font-semibold caption">
                  {repliedMessage.name}
                </p>
                <p className={cn("line-clamp-1 text-foreground/50 caption")}>
                  {repliedMessage.message}
                </p>
              </div>

              <Button
                variant="icon"
                size="icon-sm"
                onClick={cancelReplyMessage}
              >
                <XIcon className="" />
              </Button>
            </div>
          )}

          <div className="flex flex-1 items-end gap-x-2">
            <EmojiPopover
              onSelectEmoji={(emoji) => {
                if (message.length === 0) {
                  setIsEmojiOnly(true)
                }
                setMessage(`${message}${emoji.emoji}`)
              }}
            >
              <Button
                variant="icon"
                size="icon"
                className="size-5 p-0 hover:text-primary"
                disabled={isSending}
              >
                <SmileIcon />
              </Button>
            </EmojiPopover>

            <TextEditor
              value={message}
              disabled={isSending}
              onValueChange={(value) => {
                setMessage(value)
                if (isEmojiOnly) {
                  setIsEmojiOnly(false)
                }
              }}
            />

            <div className="gap-x-2 flex-center-end">
              <input
                type="file"
                hidden
                ref={inputImageRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <Button
                variant="icon"
                size="icon"
                className="size-5 p-0 hover:text-primary"
                disabled={isSending}
                onClick={() => inputImageRef.current?.click()}
              >
                <ImageIcon />
              </Button>
              <input
                type="file"
                hidden
                ref={inputFileRef}
                accept="*"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              <Button
                variant="icon"
                size="icon"
                className="size-5 p-0 hover:text-primary"
                disabled={isSending}
                onClick={() => inputFileRef.current?.click()}
              >
                <PaperclipIcon />
              </Button>
            </div>
          </div>
        </div>
        {message.length > 0 || audioUrl ? (
          <Button
            className="size-11 bg-surface hover:bg-primary"
            variant="secondary"
            disabled={isSending}
            onClick={handleSend}
          >
            {isSending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SendHorizonalIcon />
            )}
          </Button>
        ) : (
          <AudioRecorder onStop={setRecordedAudio} />
        )}
      </div>
    </div>
  )
}

export default ChatInput
