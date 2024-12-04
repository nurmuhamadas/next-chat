import { mergeName } from "@/lib/utils"

export const getFileType = (mimeType: string): AttachmentType => {
  switch (mimeType) {
    case "image/jpeg":
    case "image/png":
    case "image/jpg":
    case "image/webp":
    case "image/gif":
      return "IMAGE"

    case "audio/mpeg":
    case "audio/wav":
      return "AUDIO"

    case "video/mp4":
      return "VIDEO"

    case "application/pdf":
      return "PDF"

    default:
      return "OTHER"
  }
}

export const mapMessageModelToMessage = (
  message: MessageAWModel,
  user: UserAWModel,
  attachments: Attachment[],
  isRead: boolean,
): Message => {
  return {
    id: message.$id,
    user: mapUserModelToMessageAuthor(user),
    message: message.message ?? null,
    conversationId: message.conversationId ?? null,
    groupId: message.groupId ?? null,
    channelId: message.channelId ?? null,
    parentMessageId: message.parentMessageId ?? null,
    parentMessageName: message.parentMessageName ?? null,
    parentMessageText: message.parentMessageText ?? null,
    originalMessageId: message.originalMessageId ?? null,
    isEmojiOnly: message.isEmojiOnly,
    status: message.status,
    isRead,
    attachments,
    updatedAt: message.updatedAt ?? null,
  }
}

export const mapUserModelToMessageAuthor = (
  user: UserAWModel,
): MessageAuthor => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  }
}

export const mapAttachmentModelToAttachment = (
  attachment: AttachmentAWModel,
  messageId: string,
): Attachment => {
  return {
    id: attachment.$id,
    messageId,
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
    url: attachment.url,
  }
}
