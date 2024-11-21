"use client"

import { useState } from "react"

import { PencilIcon, TvIcon, UsersIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreateChannelModal from "@/features/channel/components/create-channel-modal"
import CreateGroupModal from "@/features/group/components/create-group-modal"

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)

  return (
    <div className="absolute bottom-4 right-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <Button className="size-12 shadow-sm hover:bg-primary-hover">
            {isOpen ? <XIcon /> : <PencilIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem
            className="py-2.5"
            onClick={() => setIsCreateGroupOpen(true)}
          >
            <UsersIcon /> New Group
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2.5"
            onClick={() => setIsCreateChannelOpen(true)}
          >
            <TvIcon /> New Channel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateGroupModal
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
      />
      <CreateChannelModal
        open={isCreateChannelOpen}
        onOpenChange={setIsCreateChannelOpen}
      />
    </div>
  )
}

export default FloatingButton
