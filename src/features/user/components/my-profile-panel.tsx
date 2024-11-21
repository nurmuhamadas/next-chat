"use client"

import { ReactNode } from "react"

import {
  AtSignIcon,
  InfoIcon,
  LucideIcon,
  MailIcon,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"

import ChatAvatar from "@/components/chat-avatar"
import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { Button } from "@/components/ui/button"
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
    <>
      <LeftPanelWrapper
        title="My Profile"
        isOpen={isMyProfileOpen}
        onBack={closeMyProfile}
        action={
          <Button variant="icon" size="icon" onClick={() => {}}>
            <PencilIcon />
          </Button>
        }
      >
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
      </LeftPanelWrapper>
    </>
  )
}

export default MyProfilePanel
