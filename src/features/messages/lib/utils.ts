import {
  Attachment as AttachmentModel,
  Message as MessageModel,
  Profile as ProfileModel,
} from "@prisma/client"

export const getMessageInludeQuery = () => ({
  attachments: true,
  repliedMessage: {
    select: {
      id: true,
      message: true,
      sender: {
        select: {
          id: true,
          profile: { select: { name: true } },
        },
      },
    },
  },
  sender: {
    select: {
      id: true,
      profile: { select: { name: true, imageUrl: true } },
    },
  },
})

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
  userId: string,
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
  const isDeleted =
    message.status === "DELETED_BY_ADMIN" ||
    message.status === "DELETED_FOR_ALL"

  let messageText = message.message
  if (isDeleted) {
    messageText = message.status
  }

  return {
    id: message.id,
    message: messageText,
    sender: {
      id: message.sender.id,
      name: message.sender.profile?.name ?? "Unknown",
      imageUrl: message.sender.profile?.imageUrl ?? null,
    },
    isSender: userId === message.sender.id,
    privateChatId: message.privateChatId,
    groupId: message.groupId,
    channelId: message.channelId,
    isEmojiOnly: isDeleted ? false : message.isEmojiOnly,
    originalMessageId: message.originalMessageId,
    parentMessageId: isDeleted ? null : (message.repliedMessage?.id ?? null),
    parentMessageName: isDeleted
      ? null
      : (message.repliedMessage?.sender.profile?.name ?? null),
    parentMessageText: isDeleted
      ? null
      : (message.repliedMessage?.message ?? null),
    status: message.status,
    attachments: isDeleted
      ? []
      : message.attachments.map((att) => {
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
    isUpdated: isDeleted
      ? false
      : message.updatedAt.toISOString() !== message.createdAt.toISOString(),
    createdAt: message.createdAt?.toISOString(),
  }
}
