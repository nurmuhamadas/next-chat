import React, { useEffect, useState } from "react"

import { BellIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useUpdateGroupOption from "@/features/group/hooks/api/use-update-group-option"
import { useRoomId } from "@/hooks/use-room-id"

import { useRoomProfile } from "../../hooks/use-room-profile"

const RoomProfileOptionsGroup = () => {
  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const [isNotifActive, setIsNotifActive] = useState(false)

  const { mutate: updateOption, isPending: isUpdating } = useUpdateGroupOption()

  const {
    data: option,
    isLoading: isOptionLoading,
    refetch: refetchOption,
  } = useGetGroupOption({ groupId: roomProfileOpen ? id : undefined })

  const isNoOption = isOptionLoading || !option

  const handleNotifChange = (value: boolean) => {
    setIsNotifActive(value)
    updateOption(
      {
        json: { notification: value },
        param: { groupId: id },
      },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  useEffect(() => {
    if (option) {
      setIsNotifActive(option.notification)
    }
  }, [option])

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

export default RoomProfileOptionsGroup
