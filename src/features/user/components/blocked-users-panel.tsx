import ChatAvatar from "@/components/chat-avatar"
import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { Button } from "@/components/ui/button"

import { useBlockedUsersPanel } from "../hooks/use-blocked-users-panel"

const BlockedUsersPanel = () => {
  const { isBlockedUsersOpen, closeBlockedUsers } = useBlockedUsersPanel()

  return (
    <LeftPanelWrapper
      isOpen={isBlockedUsersOpen}
      title="Blocked users"
      onBack={closeBlockedUsers}
    >
      <ul className="flex flex-col px-1.5 pt-2">
        {[1, 2, 3].map((v) => {
          return (
            <li
              key={v}
              className="flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-background/50"
            >
              <ChatAvatar className="size-[54px]" />
              <p className="line-clamp-1 flex-1 subtitle-1">
                Username pasnjaals akml aldkm adlk
              </p>
              <Button variant="outline">Unblock</Button>
            </li>
          )
        })}
      </ul>
    </LeftPanelWrapper>
  )
}

export default BlockedUsersPanel
