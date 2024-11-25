import { XIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoomType } from "@/hooks/use-room-type"

import { useForwardMessage } from "../hooks/use-forward-message"

const ForwardMessageModal = () => {
  const type = useRoomType()
  const { isForwardModalOpen, cancelForwardMessage } = useForwardMessage()

  const handleSelectUser = () => {}

  return (
    <Dialog open={isForwardModalOpen} onOpenChange={cancelForwardMessage}>
      <DialogContent hideCloseButton className="max-w-[450px] p-0">
        <DialogHeader className="hidden">
          <DialogTitle>Forward to</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[500px] flex-col gap-y-6 p-3">
          <div className="flex items-center gap-x-2">
            <SearchBar placeholder="Forward to..." className="flex-1" />
            <Button variant="icon" size="icon" onClick={cancelForwardMessage}>
              <XIcon />
            </Button>
          </div>

          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex w-full flex-col">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
                const info =
                  type === "chat"
                    ? `Last seen at 12:00`
                    : type === "channel"
                      ? `2 subscribers`
                      : "2 members"

                return (
                  <li
                    key={v}
                    className="flex cursor-pointer items-center gap-x-3 rounded-lg p-2 hover:bg-grey-4"
                    onClick={() => handleSelectUser()}
                  >
                    <ChatAvatar />
                    <div className="flex flex-1 flex-col gap-y-0.5">
                      <p className="subtitle-2">User/Group/Channel Name</p>
                      <p className="text-muted-foreground caption">{info}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForwardMessageModal
