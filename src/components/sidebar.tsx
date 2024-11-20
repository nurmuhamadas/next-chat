import { cn } from "@/lib/utils"

import ChatListPanel from "../features/chat/components/chat-list-panel"

interface SidebarProps {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={cn("h-screen bg-surface", className)}>
      <ChatListPanel />
    </aside>
  )
}

export default Sidebar
