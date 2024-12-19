import { prisma } from "@/lib/prisma"

export const createGroupOption = ({
  userId,
  groupId,
  notification = true,
}: {
  userId: string
  groupId: string
  notification?: boolean
}) => {
  return prisma.groupOption.create({
    data: { userId, groupId, notification },
  })
}

export const updateGroupOption = (
  id: string,
  {
    notification,
  }: {
    notification?: boolean
  },
) => {
  return prisma.groupOption.update({
    where: { id },
    data: { notification },
  })
}
