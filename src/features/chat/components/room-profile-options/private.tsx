import React, { useEffect, useState } from "react"

import { BellIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { useRoomId } from "@/hooks/use-room-id"

import useGetPrivateChatOption from "../../hooks/api/use-get-private-chat-option"
import useUpdatePrivateChatOption from "../../hooks/api/use-update-private-chat-option"

const RoomProfileOptionsPrivate = () => {
  const id = useRoomId()

  const [isNotifActive, setIsNotifActive] = useState(false)

  const { mutate: updateOption, isPending: isUpdating } =
    useUpdatePrivateChatOption()

  const {
    data: convOption,
    isLoading: isOptionLoading,
    refetch: refetchOption,
  } = useGetPrivateChatOption({ id })
  const isNoOption = !isOptionLoading && !convOption

  const handleNotifChange = (value: boolean) => {
    setIsNotifActive(value)
    updateOption(
      {
        json: { notification: value },
        param: { conversationId: id },
      },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  useEffect(() => {
    if (convOption) {
      setIsNotifActive(convOption.notification)
    }
  }, [convOption])

  if (isOptionLoading || isNoOption) {
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
        <div className="flex-1 flex-center-between">
          <p className="subtitle-2">Notifications</p>

          <Switch
            disabled={isUpdating}
            checked={isNotifActive}
            onCheckedChange={handleNotifChange}
          />
        </div>
      </div>
    </li>
  )
}

export default RoomProfileOptionsPrivate
