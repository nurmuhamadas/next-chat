"use client"

import { ReactNode } from "react"

import {
  AtSignIcon,
  InfoIcon,
  LucideIcon,
  MailIcon,
  PaperclipIcon,
  PencilIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import RightPanelWrapper from "@/components/right-panel-wrapper"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import useGetIsChannelAdmin from "@/features/channel/hooks/api/use-get-is-channel-admin"
import { useEditChannelPanel } from "@/features/channel/hooks/use-edit-channel-panel"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useGetIsGroupAdmin from "@/features/group/hooks/api/use-get-is-group-admin"
import { useEditGroupPanel } from "@/features/group/hooks/use-edit-group-panel"
import useGetUserProfileById from "@/features/user/hooks/api/use-get-profile-by-id"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"

import ChatAvatar from "../../../components/chat-avatar"
import { useRoomProfile } from "../hooks/use-room-profile"

import RoomProfileMembers from "./room-profile-members"
import RoomProfileOptions from "./room-profile-options"

const RoomProfilePanel = () => {
  const { isDesktop } = useWindowSize()

  const type = useRoomType()
  const id = useRoomId()

  const { openEditGroup } = useEditGroupPanel()
  const { openEditChannel } = useEditChannelPanel()

  const { roomProfileOpen, closeRoomProfile } = useRoomProfile()

  const isOpen = roomProfileOpen

  const { data: isGroupAdmin } = useGetIsGroupAdmin({
    id: isOpen && type === "group" ? id : undefined,
  })
  const { data: isChannelAdmin } = useGetIsChannelAdmin({
    id: isOpen && type === "channel" ? id : undefined,
  })
  const isAdmin = isGroupAdmin || isChannelAdmin

  const handleEdit = () => {
    if (!isAdmin) return

    if (type === "group") {
      openEditGroup(id)
    } else if (type === "channel") {
      openEditChannel(id)
    }
  }

  const title =
    (type === "chat" ? "User" : type === "channel" ? "Channel" : "Group") +
    " Info"
  const action = (type === "channel" || type === "group") && (
    <Button variant="icon" size="icon" onClick={handleEdit}>
      <PencilIcon />
    </Button>
  )

  if (!isDesktop) {
    return (
      <RightPanelWrapper
        title={title}
        isOpen={roomProfileOpen}
        onBack={closeRoomProfile}
        action={isAdmin ? action : undefined}
      >
        <ProfileView />
      </RightPanelWrapper>
    )
  }

  return (
    <div
      className={cn(
        isOpen ? "flex-1 max-w-[384px] duration-400" : "max-w-0 duration-150",
        "transition-all ease-linear hidden bg-surface lg:block border-l border-grey-1 ",
      )}
    >
      <div className="relative flex size-full flex-col bg-surface pt-14">
        <div className="absolute left-0 top-0 h-14 w-full gap-x-4 p-2 flex-center-between">
          <div className="flex items-center gap-x-4">
            <Button variant="icon" size="icon" onClick={closeRoomProfile}>
              <XIcon />
            </Button>
            <h3 className="line-clamp-1 h3">{title}</h3>
          </div>

          {isAdmin && <div className="gap-x-1 flex-center-end">{action}</div>}
        </div>

        <ScrollArea className="chat-list-scroll-area">
          <ProfileView />
        </ScrollArea>
      </div>
    </div>
  )
}

const ProfileView = () => {
  const type = useRoomType()
  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const { data: user, isLoading: userLoading } = useGetUserProfileById({
    id: roomProfileOpen && type === "chat" ? id : undefined,
  })
  const { data: group, isLoading: groupLoading } = useGetGroupById({
    id: roomProfileOpen && type === "group" ? id : undefined,
  })
  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: roomProfileOpen && type === "channel" ? id : undefined,
  })

  const isLoading = userLoading || groupLoading || channelLoading
  const isNoData = !isLoading && !group && !channel && !user

  const infoList: Record<
    RoomType,
    {
      label: string
      value: ReactNode
      copyText: string
      icon: LucideIcon
    }[]
  > = {
    chat: [
      {
        label: "Bio",
        value: user?.bio,
        copyText: user?.bio ?? "",
        icon: InfoIcon,
      },
      {
        label: "Username",
        value: (
          <div className="flex gap-x-2">
            <span className="truncate">@{user?.username}</span>
            <span className="text-grey-2">
              {user?.gender === "MALE" ? "(He/Him)" : "(She/Her)"}
            </span>
          </div>
        ),
        copyText: user?.username ?? "",
        icon: AtSignIcon,
      },
      {
        label: "Email",
        value: user?.email,
        copyText: user?.email ?? "",
        icon: MailIcon,
      },
    ],
    channel: [
      {
        label: "Description",
        value: channel?.description,
        copyText: channel?.description ?? "",
        icon: InfoIcon,
      },
      {
        label: "Link",
        value: `${process.env.NEXT_PUBLIC_APP_URL}/channel/${channel?.id}`,
        copyText: `${process.env.NEXT_PUBLIC_APP_URL}/channel/${channel?.id}`,
        icon: PaperclipIcon,
      },
    ],
    group: [
      {
        label: "Description",
        value: group?.description,
        copyText: group?.description ?? "",
        icon: InfoIcon,
      },
      {
        label: "Link",
        value: `${process.env.NEXT_PUBLIC_APP_URL}/group/${group?.id}`,
        copyText: `${process.env.NEXT_PUBLIC_APP_URL}/group/${group?.id}`,
        icon: PaperclipIcon,
      },
    ],
  }

  const name = {
    chat: user ? user.name : undefined,
    group: group ? group?.name : undefined,
    channel: channel ? channel?.name : undefined,
  }
  const info = {
    chat: undefined,
    group: group ? `${group?.totalMembers} members` : undefined,
    channel: channel ? `${channel?.totalSubscribers} subscribers` : undefined,
  }
  const avatar = {
    chat: user ? (user?.imageUrl ?? "") : undefined,
    group: group ? (group?.imageUrl ?? "") : undefined,
    channel: channel ? (channel?.imageUrl ?? "") : undefined,
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard")
    })
  }

  return (
    <>
      <div className="relative h-[100vw] max-h-[420] w-screen max-w-[420] lg:max-h-[384px] lg:max-w-[384px]">
        {!isLoading ? (
          <ChatAvatar
            className="size-full rounded-none"
            fallbackClassName="rounded-none !text-[72px]"
            src={avatar[type]}
            name={name[type]}
          />
        ) : (
          <Skeleton className="size-full" />
        )}
        <div className="absolute bottom-0 left-0 flex w-full flex-col bg-gradient-to-t from-black/25 to-black/0 p-4 text-white">
          {!isLoading && (
            <>
              <p className="subtitle-2">{name[type]}</p>
              <p className="opacity-75 caption">{info[type]}</p>
            </>
          )}
        </div>
      </div>
      {!isNoData && (
        <ul className="flex flex-col p-2">
          {infoList[type].map((info) => {
            const Icon = info.icon

            if (!info.value) {
              return null
            }

            return (
              <li key={info.label} className="">
                <button
                  className="flex w-full items-center gap-x-5 rounded px-1.5 py-3 hover:bg-grey-4 focus:outline-none"
                  onClick={() => handleCopy(info.copyText)}
                >
                  <Icon className="size-5 shrink-0 text-grey-3" />
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-1/2" />
                      </>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "subtitle-2",
                            info.label !== "Bio" &&
                              info.label !== "Description" &&
                              "truncate",
                          )}
                        >
                          {info.value}
                        </div>
                        <p className="text-grey-2 caption">{info.label}</p>
                      </>
                    )}
                  </div>
                </button>
              </li>
            )
          })}

          <RoomProfileOptions />
        </ul>
      )}

      {/* <Room?ProfilActions /> */}
      <RoomProfileMembers />
    </>
  )
}

export default RoomProfilePanel
