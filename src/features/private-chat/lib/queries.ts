import { PrivateChatOption as PrivateChatOptionModel } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const clearPrivateChat = ({
  userId,
  lastOption,
}: {
  userId: string
  lastOption: PrivateChatOptionModel
}) => {
  return prisma.$transaction([
    prisma.privateChatOption.deleteMany({
      where: { userId },
    }),
    prisma.privateChatOption.create({
      data: {
        userId,
        privateChatId: lastOption.privateChatId,
        notification: lastOption.notification,
      },
    }),
  ])
}
