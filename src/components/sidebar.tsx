import ChatListPanel from "@/features/chat/components/chat-list-panel"
import BlockedUsersPanel from "@/features/user/components/blocked-users-panel"
import MyProfilePanel from "@/features/user/components/my-profile-panel"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={cn("h-screen bg-surface", className)}>
      <ChatListPanel />

      <BlockedUsersPanel />

      <MyProfilePanel />
    </aside>
  )
}

export default Sidebar
