import CreateChannelPanel from "@/features/channel/components/create-channel-panel"
import RoomListPanel from "@/features/chat/components/room-list-panel"
import CreateGroupPanel from "@/features/group/components/create-group-panel"
import BlockedUsersPanel from "@/features/user/components/blocked-users-panel"
import EditMyProfilePanel from "@/features/user/components/edit-my-profile-panel"
import MyProfilePanel from "@/features/user/components/my-profile-panel"
import SettingsPanel from "@/features/user/components/settings/panel"
import { cn } from "@/lib/utils"

import ComingSoonModal from "./coming-soon-modal"

const Sidebar = ({ className }: PropwWithClassName) => {
  return (
    <aside className={cn("h-screen bg-surface", className)}>
      <ComingSoonModal />

      <RoomListPanel />

      <BlockedUsersPanel />

      <MyProfilePanel />

      <EditMyProfilePanel />

      <CreateGroupPanel />

      <CreateChannelPanel />

      <SettingsPanel />
    </aside>
  )
}

export default Sidebar
