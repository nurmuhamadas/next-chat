import { prisma } from "@/lib/prisma"

export const createChannelOption = ({
  userId,
  channelId,
  notification = true,
}: {
  userId: string
  channelId: string
  notification?: boolean
}) => {
  return prisma.channelOption.create({
    data: { userId, channelId, notification },
  })
}

export const updateChannelOption = (
  id: string,
  { notification = true }: { notification?: boolean },
) => {
  return prisma.channelOption.update({
    where: { id },
    data: { notification },
  })
}
