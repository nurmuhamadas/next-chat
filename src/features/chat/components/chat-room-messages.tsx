import Image from "next/image"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn } from "@/lib/utils"

import useCreateConversation from "../hooks/api/use-create-conversation"

import MessageList from "./message-list"

interface ChatRoomMessagesProps {
  showBlank?: boolean
  conversation?: Conversation
  isGroupMember?: boolean
  isPrivateGroup?: boolean
  isChannelSubs?: boolean
  isPrivateChannel?: boolean
}
const ChatRoomMessages = ({
  conversation,
  isGroupMember = false,
  isPrivateGroup = true,
  isChannelSubs,
  isPrivateChannel,
}: ChatRoomMessagesProps) => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const { mutate: createConversation, isPending: creatingConv } =
    useCreateConversation()

  const isEmpty = true

  const handleCreateConversation = () => {
    createConversation(
      { json: { userId: id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["conversations"],
          })
          queryClient.invalidateQueries({
            queryKey: ["conversation", id],
          })
        },
      },
    )
  }

  const showBlank =
    (type === "group" && isPrivateGroup && !isGroupMember) ||
    (type === "channel" && isPrivateChannel && !isChannelSubs)

  if (showBlank) {
    return <div className="w-full flex-1"></div>
  }

  const showConvButton = type === "chat" && !conversation

  return (
    <div
      className={cn(
        "w-full flex-1 overflow-hidden py-1",
        isEmpty && "flex-col-center",
      )}
    >
      {showConvButton && (
        <div className="m-auto gap-y-6 px-4 flex-col-center">
          <div className="gap-y-2 flex-col-center">
            <h4 className="mb-3 h4">No Conversation Started</h4>
            <Button disabled={creatingConv} onClick={handleCreateConversation}>
              {creatingConv && <LoaderIcon className="size-6 animate-spin" />}
              {creatingConv ? "Creating" : "Create"} Conversation
            </Button>
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="m-auto gap-y-6 px-4 flex-col-center">
          <Image
            src="/images/no-message.svg"
            alt="no conversation"
            width={200}
            height={169}
            className="h-auto w-28 lg:w-32"
          />
          <div className="gap-y-2 flex-col-center">
            <h4 className="h4">No Messages</h4>
          </div>
        </div>
      )}

      {!isEmpty && <MessageList />}
    </div>
  )
}

export default ChatRoomMessages
