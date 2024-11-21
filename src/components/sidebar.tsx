import ChatListPanel from "@/features/chat/components/chat-list-panel"
import MyProfilePanel from "@/features/user/components/my-profile-panel"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={cn("h-screen bg-surface", className)}>
      <MyProfilePanel />
      <ChatListPanel />
    </aside>
  )
}

export default Sidebar
