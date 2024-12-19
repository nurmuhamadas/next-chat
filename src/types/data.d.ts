declare type Gender = "MALE" | "FEMALE"

declare type MessageStatus =
  | "DEFAULT"
  | "DELETED_FOR_ME"
  | "DELETED_FOR_ALL"
  | "DELETED_BY_ADMIN"

declare type AttachmentType = "IMAGE" | "VIDEO" | "AUDIO" | "PDF" | "OTHER"

declare type GroupType = "PUBLIC" | "PRIVATE"

declare type ChannelType = "PUBLIC" | "PRIVATE"

declare type TimeFormat = "12-HOUR" | "24-HOUR"

declare type Language = "id_ID" | "en_US"

declare type NotificationType = "PRIVATE" | "GROUP" | "CHANNEL"

declare type Theme = "LIGHT" | "DARK" | "SYSTEM"

declare interface QueryResults<T> {
  total: number
  data: T[]
}

declare type QueryResult<T> = T | null

declare interface Profile {
  id: string
  name: string
  username: string
  gender: Gender
  bio: string | null
  imageUrl: string | null
  lastSeenAt: string | null
}

declare interface UserSearch {
  id: string
  name: string
  imageUrl: string | null
  lastSeenAt: string | null
}

declare interface LastMessage {
  id: string
  sender: string
  message: string | null
  time: string
}

declare interface Conversation {
  id: string
  type: RoomType
  name: string
  imageUrl: string | null
  pinned: boolean
  archived: boolean
  totalUnreadMessages: number
  lastMessage: LastMessage | null
}

declare interface ConversationOption {
  conversationId: string
  notification: boolean
}

declare interface BlockedUser {
  id: string
  name: string
  imageUrl: string | null
}

declare interface MessageAuthor {
  id: string
  name: string
  imageUrl: string | null
}
declare interface Message {
  id: string
  message: string | null
  user: MessageAuthor
  conversationId: string | null
  parentMessageId: string | null
  parentMessageName: string | null
  parentMessageText: string | null
  groupId: string | null
  channelId: string | null
  originalMessageId: string | null
  isEmojiOnly: boolean
  isRead: boolean
  status: MessageStatus
  attachments: Attachment[]
  updatedAt: string | null
  createdAt: string
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
  downloadUrl: string
  name: string
  type: AttachmentType
  size: number
  messageId: string
}

declare interface GroupOwner {
  id: string
  name: string
  imageUrl: string | null
}

declare interface Group {
  id: string
  name: string
  description: string | null
  type: GroupType
  ownerId: string
  imageUrl: string | null
  inviteCode: string
  totalMembers: number
}

declare interface GroupSearch {
  id: string
  name: string
  imageUrl: string | null
  totalMember: number
}

declare interface GroupMember {
  id: string
  name: string
  imageUrl: string | null
  isAdmin: boolean
  lastSeenAt: string | null
}

declare interface GroupOption {
  id: string
  groupId: string
  notification: boolean
}

declare interface ChannelOwner {
  id: string
  name: string
  imageUrl: string | null
}

declare interface Channel {
  id: string
  name: string
  description: string | null
  type: ChannelType
  ownerId: string
  imageUrl: string | null
  inviteCode: string
  totalSubscribers: number
}

declare interface ChannelSearch {
  id: string
  name: string
  imageUrl: string | null
  totalSubscribers: number
}

declare interface ChannelSubscriber {
  id: string
  name: string
  imageUrl: string | null
  isAdmin: boolean
  lastSeenAt: string | null
}

declare interface ChannelOption {
  id: string
  channelId: string
  notification: boolean
}

declare interface Setting {
  id: string
  userId: string
  timeFormat: TimeFormat | null
  language: Language | null
  notifications: NotificationType[] | null
  enable2FA: boolean | null
  showLastSeen: boolean | null
  allowToAddToGroup: boolean | null
}
