"use client"

import EditChannelPanel from "@/features/channel/components/edit-channel-panel"
import RoomProfilePanel from "@/features/chat/components/room-profile-panel"
import AddGroupAdminsPanel from "@/features/group/components/add-group-admins-panel"
import AddGroupMemberPanel from "@/features/group/components/add-group-member-panel"
import EditGroupPanel from "@/features/group/components/edit-group-panel"
import GroupAdminsPanel from "@/features/group/components/group-admins-panel"

const RightPanel = () => {
  return (
    <>
      <RoomProfilePanel />

      <EditGroupPanel />

      <AddGroupMemberPanel />

      <GroupAdminsPanel />

      <AddGroupAdminsPanel />

      <EditChannelPanel />
    </>
  )
}

export default RightPanel
