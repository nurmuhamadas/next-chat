import {
  Attachment as AttachmentModel,
  Message as MessageModel,
  Profile as ProfileModel,
} from "@prisma/client"

export const getFileType = (mimeType: string): AttachmentType => {
  switch (mimeType) {
    case "image/jpeg":
    case "image/png":
    case "image/jpg":
    case "image/webp":
    case "image/gif":
      return "IMAGE"

    case "audio/mpeg":
    case "audio/mp3":
    case "audio/wav":
    case "audio/webm":
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
  message: MessageModel & {
    attachments: AttachmentModel[]
    repliedMessage:
      | (Pick<MessageModel, "id" | "message"> & {
          sender: {
            id: string
            profile: Pick<ProfileModel, "name"> | null
          }
        })
      | null
    sender: {
      id: string
      profile: Pick<ProfileModel, "name" | "imageUrl"> | null
    }
  },
): Message => {
  return {
    id: message.id,
    message: message.message,
    sender: {
      id: message.sender.id,
      name: message.sender.profile?.name ?? "Unknown",
      imageUrl: message.sender.profile?.imageUrl ?? null,
    },
    privateChatId: message.privateChatId,
    groupId: message.groupId,
    channelId: message.channelId,
    isEmojiOnly: message.isEmojiOnly,
    originalMessageId: message.originalMessageId,
    parentMessageId: message.repliedMessage?.id ?? null,
    parentMessageName: message.repliedMessage?.sender.profile?.name ?? null,
    parentMessageText: message.repliedMessage?.message ?? null,
    status: message.status,
    attachments: message.attachments.map((att) => {
      return {
        id: att.id,
        name: att.name,
        size: att.size,
        type: att.type,
        url: att.url,
        downloadUrl: att.downloadUrl,
        messageId: message.id,
      }
    }),
    createdAt: message.createdAt?.toISOString(),
    updatedAt: message.updatedAt?.toISOString() ?? null,
  }
}
