import React, { useEffect, useState } from "react"

import { BellIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useUpdateChannelOption from "@/features/channel/hooks/api/use-update-channel-option"
import { useRoomId } from "@/hooks/use-room-id"
import { useScopedI18n } from "@/lib/locale/client"

import { useRoomProfile } from "../../hooks/use-room-profile"

const RoomProfileOptionsChannel = () => {
  const t = useScopedI18n("channel")

  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const [isNotifActive, setIsNotifActive] = useState(false)

  const { mutate: updateChannelOption, isPending: isUpdating } =
    useUpdateChannelOption()

  const {
    data: option,
    isLoading: isOptionLoading,
    refetch: refetchChannel,
  } = useGetChannelOption({ channelId: roomProfileOpen ? id : undefined })

  const isNoOption = isOptionLoading || !option

  const handleNotifChange = (value: boolean) => {
    setIsNotifActive(value)
    updateChannelOption(
      {
        channelId: id,
        data: { notification: value },
      },
      {
        onSuccess() {
          refetchChannel()
        },
      },
    )
  }

  useEffect(() => {
    if (option) {
      setIsNotifActive(option.notification)
    }
  }, [option])

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
          <p className="subtitle-2">{t("info.notifications")}</p>

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

export default RoomProfileOptionsChannel
