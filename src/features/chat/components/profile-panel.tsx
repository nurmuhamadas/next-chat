"use client"

import { ReactNode, useState } from "react"

import {
  AtSignIcon,
  BellIcon,
  InfoIcon,
  LogOutIcon,
  LucideIcon,
  MailIcon,
  PaperclipIcon,
  PencilIcon,
  TrashIcon,
  UserXIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import EditChannelModal from "@/features/channel/components/edit-channel-modal"
import EditGroupModal from "@/features/group/components/edit-group-modal"
import { useEditChannelModal } from "@/features/group/hooks/use-edit-channel-modal"
import { useEditGroupModal } from "@/features/group/hooks/use-edit-group-modal"
import { useRoomId } from "@/hooks/useRoomId"
import { useRoomType } from "@/hooks/useRoomType"
import { cn } from "@/lib/utils"

import { useRoomProfile } from "../hooks/useRoomProfile"

import ChatAvatar from "./chat-avatar"

const ProfilePanel = () => {
  const { closeRoomProfile } = useRoomProfile()
  const type = useRoomType()
  const id = useRoomId()

  const { openEditGroup } = useEditGroupModal()
  const { openEditChannel } = useEditChannelModal()

  const [isNotifActive, setIsNotifActive] = useState(true)

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
        value: "Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal",
        copyText:
          "Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal",
        icon: InfoIcon,
      },
      {
        label: "Username",
        value: (
          <div className="flex gap-x-2">
            <span className="truncate">@nurmuhamadas</span>
            <span className="text-grey-2">(He/Him)</span>
          </div>
        ),
        copyText: "nurmuhamadas",
        icon: AtSignIcon,
      },
      {
        label: "Email",
        value: `nurmuhamad@mail.com`,
        copyText: "nurmuhamad@mail.com",
        icon: MailIcon,
      },
    ],
    channel: [
      {
        label: "Description",
        value: `Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal `,
        copyText: `Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal `,
        icon: InfoIcon,
      },
      {
        label: "Link",
        value: `t.me/akdakd2ok33mdo`,
        copyText: `t.me/akdakd2ok33mdo`,
        icon: PaperclipIcon,
      },
    ],
    group: [
      {
        label: "Description",
        value: `Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal `,
        copyText: `Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal `,
        icon: InfoIcon,
      },
      {
        label: "Link",
        value: `t.me/akdakd2ok33mdo`,
        copyText: `t.me/akdakd2ok33mdo`,
        icon: PaperclipIcon,
      },
    ],
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard")
    })
  }

  const handleEdit = () => {
    if (type === "group") {
      openEditGroup(id)
    } else if (type === "channel") {
      openEditChannel(id)
    }
  }

  return (
    <div className="relative flex size-full flex-col bg-surface pt-14">
      <div className="absolute left-0 top-0 h-14 w-full gap-x-4 p-2 flex-center-between">
        <div className="flex items-center gap-x-4">
          <Button variant="icon" size="icon" onClick={closeRoomProfile}>
            <XIcon />
          </Button>
          <h3 className="line-clamp-1 subtitle-1">
            {type === "chat" ? "User" : type === "group" ? "Group" : "Channel"}{" "}
            Info
          </h3>
        </div>

        <div className="flex-center-end">
          {(type === "channel" || type === "group") && (
            <Button variant="icon" size="icon" onClick={handleEdit}>
              <PencilIcon />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="chat-list-scroll-area">
        <div className="relative h-[100vw] max-h-[420] w-screen max-w-[420] lg:max-h-[384px] lg:max-w-[384px]">
          <ChatAvatar
            className="size-full rounded-none"
            fallbackClassName="rounded-none !text-[72px]"
          />
          <div className="absolute bottom-0 left-0 flex w-full flex-col bg-gradient-to-t from-black/25 to-black/0 p-4 text-white">
            <p className="subtitle-2">
              {type === "chat" && "User Name"}
              {type === "group" && "Group Name"}
              {type === "channel" && "Channel Name"}
            </p>
            <p className="opacity-75 caption">
              {type === "chat" && "Last seen at 17:00"}
              {type === "group" && "2 members"}
              {type === "channel" && "2 subscribers"}
            </p>
          </div>
        </div>

        <ul className="flex flex-col p-2">
          {infoList[type].map((info) => {
            const Icon = info.icon

            return (
              <li key={info.label} className="">
                <button
                  className="flex w-full items-center gap-x-5 rounded px-1.5 py-3 hover:bg-grey-4 focus:outline-none"
                  onClick={() => handleCopy(info.copyText)}
                >
                  <Icon className="size-5 shrink-0 text-grey-3" />
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
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
                  </div>
                </button>
              </li>
            )
          })}

          <li>
            <div
              className="flex w-full items-center gap-x-5 rounded px-1.5 py-5 hover:bg-grey-4 focus:outline-none"
              onClick={() => setIsNotifActive(!isNotifActive)}
            >
              <BellIcon className="size-5 text-grey-3" />
              <div className="flex-1 flex-center-between">
                <p className="subtitle-2">Notifications</p>

                <Switch
                  checked={isNotifActive}
                  onCheckedChange={setIsNotifActive}
                />
              </div>
            </div>
          </li>
        </ul>

        <div className="flex-wrap gap-x-2.5 py-8 flex-center">
          {type === "chat" && (
            <>
              <Button variant="outline">
                <UserXIcon className="size-4" />
                Block user
              </Button>
              <Button
                variant="outline"
                className="border-error text-error hover:text-error"
              >
                <TrashIcon className="size-4" />
                Delete chat
              </Button>
            </>
          )}
          {type === "group" && (
            <>
              <Button variant="outline">
                <LogOutIcon className="size-4" />
                Leave group
              </Button>
              <Button
                variant="outline"
                className="border-error text-error hover:text-error"
              >
                <TrashIcon className="size-4" />
                Delete and exit
              </Button>
            </>
          )}
        </div>
      </ScrollArea>

      <EditGroupModal />
      <EditChannelModal />
    </div>
  )
}

export default ProfilePanel
