import { mergeName } from "@/lib/utils"

export const mapConvsModelToConversation = (
  conversation: ConversationAWModel,
  user: UserAWModel,
  lastMessage?: LastMessage,
  totalUnreadMessages?: number,
): Conversation => {
  return {
    id: conversation.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
    type: "chat",
    lastMessage: lastMessage ?? null,
    totalUnreadMessages: totalUnreadMessages ?? 0,
  }
}
