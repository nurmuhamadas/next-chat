"use client"

import { ReactNode } from "react"

import {
  ArrowLeftIcon,
  AtSignIcon,
  InfoIcon,
  LucideIcon,
  MailIcon,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"

import ChatAvatar from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import EditChannelModal from "@/features/channel/components/edit-channel-modal"
import EditGroupModal from "@/features/group/components/edit-group-modal"
import { cn } from "@/lib/utils"

import { useMyProfilePanel } from "../hooks/use-my-profile-panel"

const MyProfilePanel = () => {
  const { isMyProfileOpen, closeMyProfile } = useMyProfilePanel()

  const infoList: {
    label: string
    value: ReactNode
    copyText: string
    icon: LucideIcon
  }[] = [
    {
      label: "Bio",
      value: "Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal",
      copyText: "Lorem ipsum dolor sit amet conskadkan aksdjn ajkd sda akdmal",
      icon: InfoIcon,
    },
    {
      label: "Username",
      value: (
        <div className="flex gap-x-2">
          <span className="truncate">@nurmuhamadas</span>
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
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard")
    })
  }

  return (
    <Sheet open={isMyProfileOpen}>
      <SheetContent
        side="left"
        className="w-screen max-w-[450px] p-0 sm:max-w-[450px] md:max-w-[384px]"
        overlayClassName="md:hidden"
      >
        <SheetHeader className="hidden">
          <SheetTitle>My Profile</SheetTitle>
        </SheetHeader>

        <div className="relative flex size-full flex-col bg-surface pb-8 pt-14">
          <div className="absolute left-0 top-0 h-14 w-full gap-x-4 p-2 flex-center-between">
            <div className="flex items-center gap-x-4">
              <Button variant="icon" size="icon" onClick={closeMyProfile}>
                <ArrowLeftIcon />
              </Button>
              <h3 className="line-clamp-1 subtitle-1">My Profile</h3>
            </div>

            <div className="flex-center-end">
              <Button variant="icon" size="icon" onClick={() => {}}>
                <PencilIcon />
              </Button>
            </div>
          </div>

          <ScrollArea className="chat-list-scroll-area">
            <div className="relative h-[100vw] max-h-[450px] w-screen max-w-[450px] p-0 sm:max-h-[450px] sm:max-w-[450px] md:max-h-[384px] md:max-w-[384px]">
              <ChatAvatar
                className="size-full rounded-none"
                fallbackClassName="rounded-none !text-[72px]"
              />
            </div>

            <ul className="flex flex-col p-2">
              {infoList.map((info) => {
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
            </ul>
          </ScrollArea>

          <EditGroupModal />
          <EditChannelModal />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MyProfilePanel
