declare type Gender = "MALE" | "FEMALE"

declare type MessageStatus = "DEFAULT" | "DELETED_FOR_ME" | "DELETED_FOR_ALL"

declare type AttachmentType = "IMAGE" | "VIDEO" | "AUDIO" | "PDF" | "OTHER"

declare type GroupType = "PUBLIC" | "PRIVATE"

declare type ChannelType = "PUBLIC" | "PRIVATE"

declare type TimeFormat = "12-HOUR" | "24-HOUR"

declare type Language = "id_ID" | "en_US"

declare type NotificationType = "CONVERSATION" | "GROUP" | "CHANNEL"

declare type Theme = "LIGHT" | "DARK" | "SYSTEM"

declare interface User {
  id: string
  email: string
  firstName: string
  lastName?: string
  username: string
  gender: Gender
  bio?: string
  lastSeenAt?: Date
  createdAt: Date
  updatedAt?: Date
}

declare interface Conversation {
  id: string
  userId1: string
  userId2: string
  createdAt: Date
  updatedAt?: Date
}

declare interface ConversationOption {
  id: string
  conversationId: string
  notification: boolean
  createdAt: Date
  updatedAt?: Date
}

declare interface BlockedUser {
  id: string
  userId: string
  blockedUserId: string
  createdAt: Date
  updatedAt?: Date
}

declare interface Message {
  id: string
  message: string
  userId: string
  conversationId?: string
  parentMessageId?: string
  parentMessageName?: string
  parentMessageText?: string
  groupId?: string
  channelId?: string
  originalMessageId?: string
  isEmojiOnly?: boolean
  isRead?: boolean
  status: MessageStatus
  createdAt: Date
  updatedAt?: Date
}

declare interface Reaction {
  id: string
  reaction: string
  messageId: string
  userId: string
  createdAt: Date
  updatedAt?: Date
}

declare interface Attachment {
  id: string
  url: string
  name: string
  type: AttachmentType
  size: number
  messageId: string
  createdAt: Date
  updatedAt?: Date
}

declare interface Group {
  id: string
  name: string
  description?: string
  type: GroupType
  createdBy: string
  imageUrl?: string
  createdAt: Date
  updatedAt?: Date
}

declare interface GroupOption {
  id: string
  groupId: string
  notification: boolean
  createdAt: Date
  updatedAt?: Date
}

declare interface Channel {
  id: string
  name: string
  description?: string
  type: ChannelType
  createdBy: string
  imageUrl?: string
  createdAt: Date
  updatedAt?: Date
}

declare interface ChannelOption {
  id: string
  channelId: string
  notification: boolean
  createdAt: Date
  updatedAt?: Date
}

declare interface Setting {
  id: string
  userId: string
  timeFormat?: TimeFormat
  language?: Language
  notifications?: NotificationType[]
  enable2FA?: boolean
  showLastSeen?: boolean
  allowToAddToGroup?: boolean
  createdAt: Date
  updatedAt?: Date
}
