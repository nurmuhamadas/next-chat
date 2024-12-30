"use client"

import EditChannelPanel from "@/features/channel/components/edit-channel-panel"
import RoomProfilePanel from "@/features/chat/components/room-profile-panel"
import AddGroupMemberPanel from "@/features/group/components/add-group-member-panel"
import EditGroupPanel from "@/features/group/components/edit-group-panel"

const RightPanel = () => {
  return (
    <>
      <RoomProfilePanel />

      <EditGroupPanel />

      <AddGroupMemberPanel />

      <EditChannelPanel />
    </>
  )
}

export default RightPanel
