import { Gender } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const createUserProfile = (data: {
  name: string
  gender: Gender
  bio?: string
  imageUrl?: string
  userId: string
}) => {
  return prisma.profile.create({
    data,
    include: { user: { select: { username: true } } },
  })
}

export const updateUserProfile = (
  id: string,
  data: {
    name?: string
    gender?: Gender
    bio?: string
    imageUrl?: string
    userId: string
  },
) => {
  return prisma.profile.update({
    where: { id },
    data,
    include: { user: { select: { username: true } } },
  })
}
