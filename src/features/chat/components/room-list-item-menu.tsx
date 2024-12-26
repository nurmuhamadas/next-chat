import { useQueryClient } from "@tanstack/react-query"
import { ChevronDownIcon, LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import { cn } from "@/lib/utils"

import { chatRoomListMenu } from "../constants"
import useArchiveRoom from "../hooks/api/use-archive-room"
import useDeleteRoom from "../hooks/api/use-delete-room"
import usePinRoom from "../hooks/api/use-pin-room"
import useUnpinRoom from "../hooks/api/use-unpin-room"

interface RoomListItemMenuProps {
  room: Room
}

const RoomListItemMenu = ({ room }: RoomListItemMenuProps) => {
  const queryClient = useQueryClient()

  const { data: groupOption, isLoading: loadingGroupOpt } = useGetGroupOption({
    groupId: room.type === "group" ? room.id : undefined,
  })
  const { data: channelOption, isLoading: loadingChannelOpt } =
    useGetChannelOption({
      channelId: room.type === "channel" ? room.id : undefined,
    })

  const { mutate: pinRoom, isPending: isPinning } = usePinRoom()
  const { mutate: unpinRoom, isPending: isUnpinning } = useUnpinRoom()
  const { mutate: archiveRoom, isPending: isArchiving } = useArchiveRoom()
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom()

  const isLoading = loadingGroupOpt || loadingChannelOpt

  const handlePinRoom = () => {
    pinRoom(
      { param: { roomId: room.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
      },
    )
  }

  const handleUnpinRoom = () => {
    unpinRoom(
      { param: { roomId: room.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
      },
    )
  }

  const handleArchiveRoom = () => {
    archiveRoom(
      { param: { roomId: room.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
      },
    )
  }

  const handleDeleteRoom = () => {
    deleteRoom(
      { param: { roomId: room.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
      },
    )
  }

  const handleMenuClick = (action: ChatRoomListMenuAction) => {
    switch (action) {
      case "pin":
        handlePinRoom()
        break
      case "unpin":
        handleUnpinRoom()
        break
      case "archive":
        handleArchiveRoom()
        break
      case "delete":
        handleDeleteRoom()
        break
      default:
        break
    }
  }

  const isActionLoading: Record<ChatRoomListMenuAction, boolean> = {
    pin: isPinning,
    unpin: isUnpinning,
    archive: isArchiving,
    delete: isDeleting,
  }

  const isMenuShown: Record<ChatRoomListMenuAction, boolean> = {
    pin: !room.pinned,
    unpin: room.pinned,
    archive: !room.archived,
    delete:
      room.type === "chat" ||
      (room.type === "group" && !groupOption) ||
      (room.type === "channel" && !channelOption),
  }

  const menuList = chatRoomListMenu.filter((menu) => {
    return isMenuShown[menu.action]
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button variant="icon" size="icon">
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-52">
        {isLoading && (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-4 animate-spin" />
          </div>
        )}
        {!isLoading &&
          menuList.map((menu) => {
            return (
              <DropdownMenuItem
                key={menu.label}
                className={cn(
                  "py-2.5 body-2",
                  menu.danger && "text-error hover:!text-error",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMenuClick(menu.action)
                }}
              >
                {isActionLoading[menu.action] ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <menu.icon className="!size-4" />
                )}{" "}
                {menu.label}
              </DropdownMenuItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RoomListItemMenu
