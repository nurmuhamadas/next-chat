import { useRef } from "react"

import { LoaderIcon, UserPlusIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoomId } from "@/hooks/use-room-id"
import { cn } from "@/lib/utils"

import useGetChannelById from "../hooks/api/use-get-channel-by-id"
import useGetChannelOption from "../hooks/api/use-get-channel-option"
import useGetChannelSubscribers from "../hooks/api/use-get-channel-subscribers"
import useRemoveChannelAdmin from "../hooks/api/use-remove-channel-admin"
import { useAddChannelAdminPanel } from "../hooks/use-add-channel-admin-panel"
import { useChannelAdminsPanel } from "../hooks/use-channel-admins-panel"

const ChannelAdminsPanel = () => {
  const id = useRoomId()

  const removeUserId = useRef<string | null>(null)

  const { isChannelAdminsOpen, closeChannelAdmins } = useChannelAdminsPanel()
  const { openAddChannelAdmin } = useAddChannelAdminPanel()

  const { mutate: removeAdmin, isPending } = useRemoveChannelAdmin()

  const {
    data: members,
    isLoading: loadingMember,
    refetch: refetchMembers,
  } = useGetChannelSubscribers({
    channelId: isChannelAdminsOpen ? id : undefined,
  })
  const { data: channel, isLoading: loadingChannel } = useGetChannelById({
    id: isChannelAdminsOpen ? id : undefined,
  })
  const { data: channelOption, isLoading: loadingOption } = useGetChannelOption(
    {
      channelId: isChannelAdminsOpen ? id : undefined,
    },
  )

  const isLoading = loadingMember || loadingChannel || loadingOption
  const admins = members.filter((member) => member.isAdmin)

  const handleRemoveAdmin = (user: ChannelSubscriber) => {
    if (isPending) return

    removeUserId.current = user.id
    removeAdmin(
      {
        param: { channelId: id, userId: user.id },
      },
      {
        onSuccess() {
          refetchMembers()
        },
        onSettled() {
          removeUserId.current = null
        },
      },
    )
  }

  return (
    <RightPanelWrapper
      title="Administrators"
      isOpen={isChannelAdminsOpen}
      onBack={closeChannelAdmins}
      action={
        <SimpleTooltip content="Add admin">
          <Button variant="icon" size="icon" onClick={openAddChannelAdmin}>
            <UserPlusIcon />
          </Button>
        </SimpleTooltip>
      }
    >
      <div className="flex flex-col gap-y-6 px-4 pb-8 pt-4">
        <p className="text-muted-foreground body-2">
          You can add admins to help you manage your channel.
        </p>
        {isLoading ? (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        ) : channel?.isAdmin ? (
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col">
              {admins.map((user) => {
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
                        onClick={() => handleRemoveAdmin(user)}
                      >
                        {isPending && removeUserId.current === user.id && (
                          <LoaderIcon className="size-4 animate-spin" />
                        )}
                        Remove
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>
    </RightPanelWrapper>
  )
}

export default ChannelAdminsPanel
