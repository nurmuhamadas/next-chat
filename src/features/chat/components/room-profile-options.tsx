import React, { useEffect, useState } from "react"

import { BellIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useUpdateChannelOption from "@/features/channel/hooks/api/use-update-channel-option"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useUpdateGroupOption from "@/features/group/hooks/api/use-update-group-option"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import useGetConversationOption from "../hooks/api/use-get-conversation-option"
import useUpdateConversationOption from "../hooks/api/use-update-conversation-option"

const RoomProfileOptions = () => {
  const type = useRoomType()
  const id = useRoomId()

  const [isNotifActive, setIsNotifActive] = useState(false)

  const { mutate: updateConvOption, isPending: isUpdatingConv } =
    useUpdateConversationOption()
  const { mutate: updateGroupOption, isPending: isUpdatingGroup } =
    useUpdateGroupOption()
  const { mutate: updateChannelOption, isPending: isUpdatingChannel } =
    useUpdateChannelOption()
  const isUpdating = isUpdatingGroup || isUpdatingChannel || isUpdatingConv

  const {
    data: convOption,
    isLoading: convOptLoading,
    refetch: refetchConversation,
  } = useGetConversationOption({
    id: type === "chat" ? id : undefined,
  })
  const {
    data: groupOption,
    isLoading: gOptLoading,
    refetch: refetchGroup,
  } = useGetGroupOption({
    id: type === "group" ? id : undefined,
  })
  const {
    data: channelOption,
    isLoading: cOptLoading,
    refetch: refetchChannel,
  } = useGetChannelOption({
    id: type === "channel" ? id : undefined,
  })
  const isOptionLoading = gOptLoading || cOptLoading || convOptLoading
  const isNoOption =
    !isOptionLoading && !convOption && !groupOption && !channelOption

  const handleNotifChange = (value: boolean) => {
    setIsNotifActive(value)
    if (type === "group") {
      updateGroupOption(
        {
          json: { notification: value },
          param: { groupId: id },
        },
        {
          onSuccess() {
            refetchGroup()
          },
        },
      )
    } else if (type === "channel") {
      updateChannelOption(
        {
          json: { notification: value },
          param: { channelId: id },
        },
        {
          onSuccess() {
            refetchChannel()
          },
        },
      )
    } else if (type === "chat") {
      updateConvOption(
        {
          json: { notification: value },
          param: { conversationId: id },
        },
        {
          onSuccess() {
            refetchConversation()
          },
        },
      )
    }
  }

  useEffect(() => {
    if (groupOption) {
      setIsNotifActive(groupOption.notification)
    } else if (channelOption) {
      setIsNotifActive(channelOption.notification)
    } else if (convOption) {
      setIsNotifActive(convOption.notification)
    }
  }, [channelOption, groupOption, convOption])

  if (isNoOption) {
    return null
  }

  return (
    <li>
      <div
        className="flex w-full items-center gap-x-5 rounded px-1.5 py-5 hover:bg-grey-4 focus:outline-none"
        onClick={
          !isUpdating ? () => handleNotifChange(!isNotifActive) : undefined
        }
      >
        <BellIcon className="size-5 text-grey-3" />
        {isOptionLoading ? (
          <Skeleton className="h-6 w-full" />
        ) : (
          <div className="flex-1 flex-center-between">
            <p className="subtitle-2">Notifications</p>

            <Switch
              disabled={isUpdating}
              checked={isNotifActive}
              onCheckedChange={handleNotifChange}
            />
          </div>
        )}
      </div>
    </li>
  )
}

export default RoomProfileOptions
