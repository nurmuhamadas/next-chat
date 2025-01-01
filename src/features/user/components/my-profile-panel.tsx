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
import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useGetMyProfile } from "../hooks/api/use-get-my-profile"
import { useEditMyProfilePanel } from "../hooks/use-edit-my-profile-panel"
import { useMyProfilePanel } from "../hooks/use-my-profile-panel"

const MyProfilePanel = () => {
  const { isMyProfileOpen, closeMyProfile } = useMyProfilePanel()
  const { openEditMyProfile } = useEditMyProfilePanel()

  const { data, isLoading } = useGetMyProfile({ enabled: isMyProfileOpen })

  const infoList: {
    label: string
    value: ReactNode
    copyText: string
    icon: LucideIcon
  }[] = [
    {
      label: "Bio",
      value: data?.bio,
      copyText: data?.bio ?? "",
      icon: InfoIcon,
    },
    {
      label: "Username",
      value: (
        <div className="flex gap-x-2">
          <span className="truncate">@{data?.username}</span>
        </div>
      ),
      copyText: data?.username ?? "",
      icon: AtSignIcon,
    },
    {
      label: "Email",
      value: data?.email,
      copyText: data?.email ?? "",
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
          <SimpleTooltip content="Edit profile">
            <Button variant="icon" size="icon" onClick={openEditMyProfile}>
              <PencilIcon />
            </Button>
          </SimpleTooltip>
        }
      >
        <div className="relative h-[100vw] max-h-[450px] w-screen max-w-[450px] p-0 sm:max-h-[450px] sm:max-w-[450px] md:max-h-[384px] md:max-w-[384px]">
          {isLoading ? (
            <Skeleton className="size-full" />
          ) : (
            <ChatAvatar
              src={data?.imageUrl ?? ""}
              name={data?.name}
              className="size-full rounded-none"
              fallbackClassName="rounded-none !text-[72px]"
            />
          )}
        </div>

        <ul className="flex flex-col p-2">
          {infoList.map((info) => {
            const Icon = info.icon

            return (
              <li key={info.label} className="">
                <SimpleTooltip content={`Copy ${info.label}`}>
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
                </SimpleTooltip>
              </li>
            )
          })}
        </ul>
      </LeftPanelWrapper>
    </>
  )
}

export default MyProfilePanel
