import { useState } from "react"

import { PencilIcon, TvIcon, UsersIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCreateChannelPanel } from "@/features/channel/hooks/use-create-channel-modal"
import { useCreateGroupPanel } from "@/features/group/hooks/use-create-group-panel"

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { openCreateChannel } = useCreateChannelPanel()
  const { openCreateGroup } = useCreateGroupPanel()

  return (
    <div className="absolute bottom-4 right-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <Button className="size-12 shadow-sm hover:bg-primary-hover">
            {isOpen ? <XIcon /> : <PencilIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem className="py-2.5" onClick={openCreateGroup}>
            <UsersIcon /> New Group
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2.5" onClick={openCreateChannel}>
            <TvIcon /> New Channel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default FloatingButton
