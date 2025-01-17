"use client"

import { ReactNode } from "react"

import {
  AtSignIcon,
  InfoIcon,
  LucideIcon,
  MailIcon,
  PaperclipIcon,
  PencilIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import RightPanelWrapper from "@/components/right-panel-wrapper"
import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import { useEditChannelPanel } from "@/features/channel/hooks/use-edit-channel-panel"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import { useAddGroupMemberPanel } from "@/features/group/hooks/use-add-group-member-panel"
import { useEditGroupPanel } from "@/features/group/hooks/use-edit-group-panel"
import useGetUserProfileById from "@/features/user/hooks/api/use-get-profile-by-id"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import useWindowSize from "@/hooks/use-window-size"
import { useI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import ChatAvatar from "../../../components/chat-avatar"
import { useRoomProfile } from "../hooks/use-room-profile"

import RoomProfileMembers from "./room-profile-members"
import RoomProfileOptions from "./room-profile-options"

const RoomProfilePanel = () => {
  const t = useI18n()

  const { isDesktop } = useWindowSize()

  const type = useRoomType()
  const id = useRoomId()

  const { openEditGroup } = useEditGroupPanel()
  const { openEditChannel } = useEditChannelPanel()

  const { openAddGroupMember } = useAddGroupMemberPanel()
  const { roomProfileOpen, closeRoomProfile } = useRoomProfile()

  const isOpen = roomProfileOpen

  const { data: group } = useGetGroupById({
    id: isOpen && type === "group" ? id : undefined,
  })
  const { data: channel } = useGetChannelById({
    id: isOpen && type === "channel" ? id : undefined,
  })
  const isAdmin = group?.isAdmin || channel?.isAdmin

  const handleEdit = () => {
    if (!isAdmin) return

    if (type === "group") {
      openEditGroup(id)
    } else if (type === "channel") {
      openEditChannel(id)
    }
  }

  const handleAddMembers = () => {
    if (!isAdmin) return

    if (type === "group") {
      openAddGroupMember()
    }
  }

  const title = {
    chat: t("private_chat.info.title"),
    group: t("group.info.title"),
    channel: t("channel.info.title"),
  }
  const action = (type === "channel" || type === "group") && (
    <>
      {type === "group" && (
        <SimpleTooltip content={t("group.tooltip.add_members")}>
          <Button variant="icon" size="icon" onClick={handleAddMembers}>
            <UserPlusIcon />
          </Button>
        </SimpleTooltip>
      )}
      <SimpleTooltip
        content={
          type === "channel"
            ? t("channel.tooltip.edit")
            : t("group.tooltip.edit")
        }
      >
        <Button variant="icon" size="icon" onClick={handleEdit}>
          <PencilIcon />
        </Button>
      </SimpleTooltip>
    </>
  )

  if (!isDesktop) {
    return (
      <RightPanelWrapper
        title={title[type]}
        isOpen={roomProfileOpen}
        onBack={closeRoomProfile}
        action={isAdmin ? action : undefined}
      >
        <ProfileView group={group} channel={channel} />
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
            <SimpleTooltip content="Close">
              <Button variant="icon" size="icon" onClick={closeRoomProfile}>
                <XIcon />
              </Button>
            </SimpleTooltip>
            <h3 className="line-clamp-1 h3">{title[type]}</h3>
          </div>

          {isAdmin && <div className="gap-x-1 flex-center-end">{action}</div>}
        </div>

        <ScrollArea className="chat-list-scroll-area">
          <ProfileView group={group} channel={channel} />
        </ScrollArea>
      </div>
    </div>
  )
}

interface ProfileViewProps {
  group?: Group
  channel?: Channel
}
const ProfileView = ({ group, channel }: ProfileViewProps) => {
  const t = useI18n()

  const type = useRoomType()
  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const { data: user, isLoading: userLoading } = useGetUserProfileById({
    id: roomProfileOpen && type === "chat" ? id : undefined,
  })

  const isLoading = userLoading
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
        label: t("private_chat.info.bio"),
        value: user?.bio,
        copyText: user?.bio ?? "",
        icon: InfoIcon,
      },
      {
        label: t("private_chat.info.username"),
        value: (
          <div className="flex gap-x-2">
            <span className="truncate">@{user?.username}</span>
            <span className="text-grey-2">
              {user?.gender === "MALE"
                ? t("private_chat.info.male")
                : t("private_chat.info.female")}
            </span>
          </div>
        ),
        copyText: user?.username ?? "",
        icon: AtSignIcon,
      },
      {
        label: t("private_chat.info.email"),
        value: user?.email,
        copyText: user?.email ?? "",
        icon: MailIcon,
      },
    ],
    channel: [
      {
        label: t("channel.info.description"),
        value: channel?.description,
        copyText: channel?.description ?? "",
        icon: InfoIcon,
      },
      {
        label: t("channel.info.link"),
        value: `${window.location.origin}/invite/channel/${channel?.id}?inviteCode=${channel?.inviteCode}`,
        copyText: `${window.location.origin}/invite/channel/${channel?.id}?inviteCode=${channel?.inviteCode}`,
        icon: PaperclipIcon,
      },
    ],
    group: [
      {
        label: t("group.info.description"),
        value: group?.description,
        copyText: group?.description ?? "",
        icon: InfoIcon,
      },
      {
        label: t("group.info.link"),
        value: `${window.location.origin}/invite/group/${group?.id}?inviteCode=${group?.inviteCode}`,
        copyText: `${window.location.origin}/invite/group/${group?.id}?inviteCode=${group?.inviteCode}`,
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
    group: group
      ? t("group.info.total_members", { count: group?.totalMembers })
      : undefined,
    channel: channel
      ? t("channel.info.total_subscribers", {
          count: channel?.totalSubscribers,
        })
      : undefined,
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
