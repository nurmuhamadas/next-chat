import { useState } from "react"

import { ChevronDownIcon, XIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const users = [
  {
    id: "1",
    name: "User 1",
  },
  {
    id: "2",
    name: "User 2",
  },
  {
    id: "3",
    name: "User 3",
  },
  {
    id: "4",
    name: "User 4",
  },
  {
    id: "5",
    name: "User 5",
  },
  {
    id: "6",
    name: "User 6",
  },
  {
    id: "7",
    name: "User 7",
  },
  {
    id: "8",
    name: "User 8",
  },
  {
    id: "9",
    name: "User 9",
  },
  {
    id: "10",
    name: "User 10",
  },
]

interface SelectUsersProps {
  selectedIds: string[]
  onValuesChange(id: string[]): void
}

const SelectUsers = ({
  selectedIds = [],
  onValuesChange,
}: SelectUsersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedUsers = users.filter((v) => selectedIds.includes(v.id))

  const handleChange = (id: string) => {
    if (selectedIds.includes(id)) {
      handleRemove(id)
    } else {
      onValuesChange([...selectedIds, id])
    }
  }

  const handleRemove = (id: string) => {
    onValuesChange(selectedIds.filter((v) => v !== id))
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-14 w-full justify-between rounded"
          >
            <p className="text-muted-foreground">Select members</p>
            <ChevronDownIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[268px] w-screen max-w-[351px] overflow-y-auto">
          {users.map(({ id, name }) => {
            return (
              <DropdownMenuItem
                key={id}
                onClick={(e) => {
                  e.preventDefault()
                  handleChange(id)
                }}
                className="cursor-pointer"
              >
                <ChatAvatar />
                <div className="flex flex-1 flex-col">
                  <p className="line-clamp-1 subtitle-2">{name}</p>
                  <p className="text-muted-foreground caption">Last seen at</p>
                </div>
                <Checkbox checked={selectedIds.includes(id)} />
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map(({ id, name }) => {
          return (
            <Badge key={id} variant="secondary" className="rounded-full py-1.5">
              <ChatAvatar className="size-6" fallbackClassName="caption" />
              <p className="mx-2 line-clamp-1">{name}</p>
              <Button
                variant="icon"
                size="icon-sm"
                className=""
                onClick={() => handleRemove(id)}
              >
                <XIcon />
              </Button>
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

export default SelectUsers
