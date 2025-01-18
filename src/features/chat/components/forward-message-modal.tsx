import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, LoaderIcon, XIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetChannels from "@/features/channel/hooks/api/use-get-channels"
import useGetGroups from "@/features/group/hooks/api/use-get-groups"
import useForwardMessage from "@/features/messages/hooks/api/use-forward-message"
import { useScopedI18n } from "@/lib/locale/client"
import { debounce } from "@/lib/utils"

import useSearchPrivateRooms from "../hooks/api/use-search-private-rooms"
import { useForwardMessageModal } from "../hooks/use-forward-message-modal"

const ForwardMessageModal = () => {
  const t = useScopedI18n("messages.forward")

  const queryClient = useQueryClient()

  const { forwardMessageId, isForwardModalOpen, cancelForwardMessage } =
    useForwardMessageModal()
  const { mutate: forwardMessage, isPending: isForwarding } =
    useForwardMessage()

  const [searchKey, setSearchKey] = useState("")
  const [sendingId, setSendingId] = useState("")

  const { data: userRooms, isLoading: loadingRoom } = useSearchPrivateRooms({
    queryKey: searchKey,
    limit: 5,
    enabled: isForwardModalOpen,
  })
  const { data: groups, isLoading: loadingGroups } = useGetGroups({
    queryKey: searchKey,
    limit: 5,
    enabled: isForwardModalOpen,
  })
  const { data: channels, isLoading: loadingChannels } = useGetChannels({
    queryKey: searchKey,
    limit: 5,
    enabled: isForwardModalOpen,
  })
  const isLoading = loadingRoom || loadingGroups || loadingChannels

  const debouncedSearchKey = debounce((value: string) => {
    setSearchKey(value)
  }, 500)

  const handleSelectUser = (id: string, type: RoomType) => {
    setSendingId(id)

    forwardMessage(
      {
        messageId: forwardMessageId,
        data: {
          roomType: type,
          receiverId: id,
        },
      },
      {
        onSuccess() {
          setSendingId("")
          queryClient.invalidateQueries({ queryKey: ["rooms", 20] })
        },
      },
    )
  }

  const list: {
    id: string
    type: RoomType
    name: string
    imageUrl: string | null
    info?: string
  }[] = [
    ...userRooms.map((v) => ({
      id: v.id,
      type: "chat" as RoomType,
      name: v.name,
      imageUrl: v.imageUrl,
    })),
    ...groups.map((v) => ({
      id: v.id,
      type: "group" as RoomType,
      name: v.name,
      imageUrl: v.imageUrl,
      info: `${v.totalMembers} members`,
    })),
    ...channels.map((v) => ({
      id: v.id,
      type: "channel" as RoomType,
      name: v.name,
      imageUrl: v.imageUrl,
      info: `${v.totalSubscribers} subscribers`,
    })),
  ].sort((a, b) => b.id.localeCompare(a.id))

  return (
    <Dialog open={isForwardModalOpen} onOpenChange={cancelForwardMessage}>
      <DialogContent hideCloseButton className="max-w-[450px] p-0">
        <DialogHeader className="hidden">
          <DialogTitle>{t("placeholder")}</DialogTitle>
        </DialogHeader>

        <div className="flex h-[400px] flex-col gap-y-6 p-3">
          <div className="flex items-center gap-x-2">
            <SearchBar
              placeholder={t("placeholder")}
              className="flex-1"
              onValueChange={debouncedSearchKey}
            />
            <Button variant="icon" size="icon" onClick={cancelForwardMessage}>
              <XIcon />
            </Button>
          </div>

          {isLoading && (
            <div className="h-40 w-full flex-center">
              <LoaderIcon className="size-5 animate-spin" />
            </div>
          )}

          {!isLoading && list.length === 0 && (
            <div className="h-40 flex-center">
              <p className="">{t("empty")}</p>
            </div>
          )}

          {!isLoading && list.length > 0 && (
            <ScrollArea className="chat-list-scroll-area">
              <ul className="flex w-full flex-col">
                {list.map((v) => {
                  return (
                    <li
                      key={v.id}
                      className="flex cursor-pointer items-center gap-x-3 rounded-lg p-2 hover:bg-grey-4"
                      onClick={() => handleSelectUser(v.id, v.type)}
                    >
                      <ChatAvatar name={v.name} src={v.imageUrl ?? ""} />
                      <div className="flex flex-1 flex-col gap-y-0.5">
                        <p className="subtitle-2">{v.name}</p>
                        <p className="text-muted-foreground caption">
                          {v.info}
                        </p>
                      </div>
                      {isForwarding && v.id === sendingId && (
                        <Loader2Icon className="mr-2 size-5 animate-spin" />
                      )}
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForwardMessageModal
