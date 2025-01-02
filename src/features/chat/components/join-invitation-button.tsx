"use client"

import { useRouter } from "next/navigation"

import { LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useJoinChannel from "@/features/channel/hooks/api/use-join-channel"
import useJoinGroup from "@/features/group/hooks/api/use-join-group"

interface JoinInvitationButtonProps {
  roomId: string
  roomType: RoomType
  inviteCode: string
}

const JoinInvitationButton = ({
  roomId,
  roomType,
  inviteCode,
}: JoinInvitationButtonProps) => {
  const router = useRouter()

  const { mutate: joinGroup, isPending: joiningGroup } = useJoinGroup()
  const { mutate: joinChannel, isPending: joiningChannel } = useJoinChannel()

  const isLoading = joiningChannel || joiningGroup

  const handleJoin = () => {
    if (roomType === "group") {
      joinGroup(
        { param: { groupId: roomId }, json: { code: inviteCode } },
        {
          onSuccess() {
            router.replace(`/${roomType}/${roomId}`)
          },
        },
      )
    }
    if (roomType === "channel") {
      joinChannel(
        { param: { channelId: roomId }, json: { code: inviteCode } },
        {
          onSuccess() {
            router.replace(`/${roomType}/${roomId}`)
          },
        },
      )
    }
  }

  return (
    <Button className="min-w-[100px]" onClick={handleJoin} disabled={isLoading}>
      {isLoading && <LoaderIcon className="size-4 animate-spin" />}
      {isLoading ? "Joining..." : "Join"}
    </Button>
  )
}

export default JoinInvitationButton
