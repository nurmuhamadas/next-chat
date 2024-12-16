import { LogActivity } from "@prisma/client"
import { addDays } from "date-fns"

import { prisma } from "@/lib/prisma"

import { getSessionExpired, getTokenExpired } from "./utils"

export const validateAuth = async () => {
  try {
    return { isLoggedIn: false, isProfileCompleted: false }
  } catch {
    return { isLoggedIn: false, isProfileCompleted: false }
  }
}

// =============== USER ===============
export const verifyUserEmail = (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { emailVerifiedAt: new Date() },
  })
}

export const updateUserPassword = ({
  id,
  password,
  sessionId,
}: {
  id: string
  password: string
  sessionId?: string
}) => {
  return prisma.user.update({
    where: { id },
    data: {
      password,
      logs: sessionId
        ? {
            create: {
              activity: "RESET_PASSWORD",
              description: "Password reset",
              sessionId,
            },
          }
        : undefined,
    },
  })
}

// =============== USER LOG ===============
export const createUserLog = ({
  activity,
  userId,
  sessionId,
  description,
}: {
  activity: LogActivity
  userId: string
  sessionId: string
  description?: string
}) => {
  return prisma.userLog.create({
    data: { activity, description, sessionId, userId },
  })
}

// =============== SESSION ===============
export const createOrUpdateSession = ({
  id = "",
  token,
  userAgent,
  userId,
  description,
}: {
  id?: string
  token: string
  userAgent: string
  userId: string
  description: string
}) => {
  const userLogs = {
    userId,
    description,
  }
  return prisma.session.upsert({
    where: { id },
    create: {
      token,
      userAgent,
      userId,
      expiresAt: getSessionExpired(),
      userLogs: {
        create: { ...userLogs, activity: LogActivity.LOGIN_NEW_DEVICE },
      },
    },
    update: {
      token,
      expiresAt: getSessionExpired(),
      userLogs: {
        create: { ...userLogs, activity: LogActivity.LOGIN },
      },
    },
  })
}

export const softDeleteSession = ({
  id,
  userId,
}: {
  id: string
  userId: string
}) => {
  return prisma.session.update({
    where: { id },
    data: {
      expiresAt: addDays(new Date(), -10),
      userLogs: {
        create: {
          activity: "LOGOUT",
          userId,
        },
      },
    },
  })
}

// =============== PASSWORD TOKEN ===============
export const createPasswordResetToken = ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  return prisma.passwordResetToken.create({
    data: { email, token, expiresAt: getTokenExpired() },
  })
}

export const deletePasswordResetToken = ({ email }: { email: string }) => {
  return prisma.passwordResetToken.delete({
    where: { email },
  })
}

// =============== VERIFICATION TOKEN ===============
export const createOrUpdateVerificationToken = ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  return prisma.verificationToken.upsert({
    where: { email },
    create: { email, token, expiresAt: getTokenExpired() },
    update: { token, expiresAt: getTokenExpired() },
  })
}

export const deleteVerificationToken = ({ email }: { email: string }) => {
  return prisma.verificationToken.delete({
    where: { email },
  })
}
