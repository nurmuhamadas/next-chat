import Image from "next/image"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"

import Loading from "@/components/loader"
import { Button } from "@/components/ui/button"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn } from "@/lib/utils"

import useCreateConversation from "../hooks/api/use-create-conversation"
import useGetConversationByUserId from "../hooks/api/use-get-conversation-by-user-id"

import MessageList from "./message-list"

const ChatRoomMessages = () => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const { mutate: createConversation, isPending: creatingConv } =
    useCreateConversation()

  const { data: conversation, isLoading: loadingConversation } =
    useGetConversationByUserId({
      id: type === "chat" ? id : undefined,
    })
  const isLoading = loadingConversation

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

  if (isLoading) {
    return <Loading />
  }

  return (
    <div
      className={cn(
        "w-full flex-1 overflow-hidden py-1",
        (!conversation || isEmpty) && "flex-col-center",
      )}
    >
      {type == "chat" && !conversation && (
        <div className="m-auto gap-y-6 px-4 flex-col-center">
          <div className="gap-y-2 flex-col-center">
            <h4 className="mb-3 h4">No Conversation Initated</h4>
            <Button disabled={creatingConv} onClick={handleCreateConversation}>
              {creatingConv && <LoaderIcon className="size-6 animate-spin" />}
              {creatingConv ? "Creating" : "Create"} conversation
            </Button>
          </div>
        </div>
      )}

      {conversation && isEmpty && (
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
            <p className="body-2">Send message and start conversation</p>
          </div>
        </div>
      )}

      {!isEmpty && <MessageList />}
    </div>
  )
}

export default ChatRoomMessages
