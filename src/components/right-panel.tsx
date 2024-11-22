"use client"

import EditChannelPanel from "@/features/channel/components/edit-channel-panel"
import RoomProfilePanel from "@/features/chat/components/room-profile-panel"
import EditGroupPanel from "@/features/group/components/edit-group-panel"

const RightPanel = () => {
  return (
    <>
      <RoomProfilePanel />

      <EditGroupPanel />

      <EditChannelPanel />
    </>
  )
}

export default RightPanel
