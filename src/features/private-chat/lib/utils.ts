import { PrivateChatOption as PrivateChatOptionModel } from "@prisma/client"

export const mapOptionModelToOption = (
  option: PrivateChatOptionModel,
): PrivateChatOption => ({
  userId: option.userId,
  privateChatId: option.privateChatId,
  notification: option.notification,
})
