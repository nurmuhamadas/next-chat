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
  imageUrl?: string
  lastSeenAt?: string
}

declare interface LastMessage {
  id: string
  name: string
  message: string
  time: string
}

declare interface Conversation {
  id: string
  type: RoomType
  name: string
  imageUrl?: string
  totalUnreadMessages: number
  lastMessage?: LastMessage
}

declare interface ConversationOption {
  conversationId: string
  notification: boolean
}

declare interface BlockedUser {
  id: string
  name: string
  imageUrl?: string
}

declare interface Message {
  id: string
  message: string
  user: {
    id: string
    name: string
    imageUrl?: string
  }
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
  createdAt: string
  updatedAt?: string
}

declare interface Reaction {
  id: string
  reaction: string
  messageId: string
  userId: string
}

declare interface Attachment {
  id: string
  url: string
  name: string
  type: AttachmentType
  size: number
  messageId: string
}

declare interface Group {
  id: string
  name: string
  description?: string
  type: GroupType
  owner: {
    id: string
    name: string
    imageUrl?: string
  }
  imageUrl?: string
  inviteCode: string
  lastMessage: LastMessage
}

declare interface GroupMember {
  id: string
  name: string
  imageUrl?: string
  isAdmin: boolean
  lastSeenAt: string
}

declare interface GroupOption {
  id: string
  groupId: string
  notification: boolean
}

declare interface Channel {
  id: string
  name: string
  description?: string
  type: ChannelType
  owner: {
    id: string
    name: string
    imageUrl?: string
  }
  imageUrl?: string
  inviteCode: string
  lastMessage: LastMessage
}

declare interface ChannelSubscriber {
  id: string
  name: string
  imageUrl?: string
  isAdmin: boolean
  lastSeenAt: string
}

declare interface ChannelOption {
  id: string
  channelId: string
  notification: boolean
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
}
