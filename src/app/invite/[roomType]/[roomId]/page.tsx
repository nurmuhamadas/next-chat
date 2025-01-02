import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import ChatAvatar from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AUTH_COOKIE_KEY } from "@/features/auth/constants"
import JoinInvitationButton from "@/features/chat/components/join-invitation-button"
import { prisma } from "@/lib/prisma"

interface InvitationPageProps {
  params: Promise<{ roomType: string; roomId: string }>
  searchParams: Promise<{ inviteCode: string }>
}
const InvitationPage = async ({
  params,
  searchParams,
}: InvitationPageProps) => {
  const { roomId, roomType } = await params
  const { inviteCode } = await searchParams

  if (roomType !== "group" && roomType !== "channel") {
    redirect("/")
  }

  const cookie = await cookies()
  const sessionToken = cookie.get(AUTH_COOKIE_KEY)!.value
  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: { select: { id: true } } },
  })

  const group =
    roomType === "group"
      ? await prisma.group.findUnique({
          where: { id: roomId },
          include: {
            members: { where: { userId: session?.user.id, leftAt: null } },
          },
        })
      : undefined
  const channel =
    roomType === "channel"
      ? await prisma.channel.findUnique({
          where: { id: roomId },
          include: {
            subscribers: {
              where: { userId: session?.user.id, unsubscribedAt: null },
            },
          },
        })
      : undefined

  if (!group && !channel) {
    return (
      <main className="h-screen w-screen flex-center">
        <Card>
          <CardHeader>
            <CardTitle>Oops! We are sorry...</CardTitle>
            <CardDescription>
              <p className="mt-3">
                {roomType === "channel" ? "Channel" : "Group"} you are search is
                not found.
                <br />
                Please make sure your invite link is correct!
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-center">
            <Button asChild variant="link">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (group?.members.length || channel?.subscribers.length) {
    redirect(`/${roomType}/${roomId}`)
  }

  const name = group?.name ?? channel?.name
  const imageUrl = group?.imageUrl ?? channel?.imageUrl ?? ""

  return (
    <main className="h-screen w-screen flex-center">
      <Card className="max-w-[350px]">
        <CardHeader className="pb-0">
          <CardTitle className="hidden">
            <h1 className="h4">You are invited!</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <ChatAvatar className="size-16" src={imageUrl} name={name} />
            <h2 className="mt-2 h5">{name}</h2>
            <p className="mt-2 text-muted-foreground body-2">
              {group?.description ?? channel?.description}
            </p>

            <div className="mt-6 flex items-center">
              <JoinInvitationButton
                roomId={roomId}
                roomType={roomType}
                inviteCode={inviteCode}
              />
              <Button asChild variant="link">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default InvitationPage
