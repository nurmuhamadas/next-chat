import { useRef } from "react"

import { LoaderIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoomId } from "@/hooks/use-room-id"
import { cn } from "@/lib/utils"

import useAddChannelAdmin from "../hooks/api/use-add-channel-admin"
import useGetChannelById from "../hooks/api/use-get-channel-by-id"
import useGetChannelOption from "../hooks/api/use-get-channel-option"
import useGetChannelSubscribers from "../hooks/api/use-get-channel-subscribers"
import { useAddChannelAdminPanel } from "../hooks/use-add-channel-admin-panel"

const AddChannelAdminsPanel = () => {
  const id = useRoomId()

  const addedUserId = useRef<string | null>(null)

  const { isAddChannelAdminOpen, closeAddChannelAdmin } =
    useAddChannelAdminPanel()

  const { mutate: addAdmin, isPending } = useAddChannelAdmin()

  const {
    data: members,
    isLoading: loadingMember,
    refetch: refetchMembers,
  } = useGetChannelSubscribers({
    channelId: isAddChannelAdminOpen ? id : undefined,
  })
  const { data: channel, isLoading: loadingChannel } = useGetChannelById({
    id: isAddChannelAdminOpen ? id : undefined,
  })
  const { data: channelOption, isLoading: loadingOption } = useGetChannelOption(
    {
      channelId: isAddChannelAdminOpen ? id : undefined,
    },
  )

  const isLoading = loadingMember || loadingChannel || loadingOption
  const usersNotadmin = members.filter((member) => !member.isAdmin)

  const handleAddAdmin = (user: ChannelSubscriber) => {
    if (isPending) return

    addedUserId.current = user.id
    addAdmin(
      {
        param: { channelId: id, userId: user.id },
      },
      {
        onSuccess() {
          refetchMembers()
        },
        onSettled() {
          addedUserId.current = null
        },
      },
    )
  }

  return (
    <RightPanelWrapper
      title="Add Administrators"
      isOpen={isAddChannelAdminOpen}
      onBack={closeAddChannelAdmin}
    >
      <div className="flex flex-col gap-y-6 px-4 pb-8 pt-4">
        {isLoading ? (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        ) : !channel?.isAdmin ? (
          <></>
        ) : usersNotadmin.length > 0 ? (
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col">
              {usersNotadmin.map((user) => {
                return (
                  <li
                    key={user.id}
                    className={cn(
                      "flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4",
                      isPending && "bg-muted",
                    )}
                  >
                    <ChatAvatar className="size-10" src={user.imageUrl ?? ""} />

                    <div className="flex flex-1 flex-col overflow-hidden">
                      <h4 className="flex-1 truncate h5">{user.name}</h4>
                    </div>

                    {channelOption?.userId !== user.id && (
                      <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleAddAdmin(user)}
                      >
                        {isPending && addedUserId.current === user.id && (
                          <LoaderIcon className="size-4 animate-spin" />
                        )}
                        Add
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        ) : (
          <div className="h-24 flex-center">
            <p className="">No users available</p>
          </div>
        )}
      </div>
    </RightPanelWrapper>
  )
}

export default AddChannelAdminsPanel
