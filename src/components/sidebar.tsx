import ChatListPanel from "@/features/chat/components/chat-list-panel"
import BlockedUsersPanel from "@/features/user/components/blocked-users-panel"
import MyProfilePanel from "@/features/user/components/my-profile-panel"
import SettingsPanel from "@/features/user/components/settings/panel"
import { cn } from "@/lib/utils"

const Sidebar = ({ className }: PropwWithClassName) => {
  return (
    <aside className={cn("h-screen bg-surface", className)}>
      <ChatListPanel />

      <BlockedUsersPanel />

      <MyProfilePanel />

      <SettingsPanel />
    </aside>
  )
}

export default Sidebar
