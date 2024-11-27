declare interface AppwriteDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
}

declare interface UserModel extends AppwriteDocument {
  email: string
  firstName: string
  lastName?: string
  username: string
  gender: Gender
  bio?: string
  imageUrl?: string
  lastSeenAt?: Date
}

declare interface ConversationModel extends AppwriteDocument {
  userId1: string
  userId2: string
}

declare interface ConversationOptionModel extends AppwriteDocument {
  conversationId: string
  notification: boolean
}

declare interface BlockedUserModel extends AppwriteDocument {
  userId: string
  blockedUserId: string
}

declare interface MessageModel extends AppwriteDocument {
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
}

declare interface ReactionModel extends AppwriteDocument {
  reaction: string
  messageId: string
  userId: string
}

declare interface AttachmentModel extends AppwriteDocument {
  url: string
  name: string
  type: AttachmentType
  size: number
  messageId: string
}

declare interface GroupModel extends AppwriteDocument {
  name: string
  description?: string
  type: GroupType
  ownerId: string
  imageUrl?: string
}

declare interface GroupOptionModel extends AppwriteDocument {
  groupId: string
  notification: boolean
}

declare interface ChannelModel extends AppwriteDocument {
  name: string
  description?: string
  type: ChannelType
  ownerId: string
  imageUrl?: string
}

declare interface ChannelOptionModel extends AppwriteDocument {
  channelId: string
  notification: boolean
}

declare interface SettingModel extends AppwriteDocument {
  userId: string
  timeFormat?: TimeFormat
  language?: Language
  notifications?: NotificationType[]
  enable2FA?: boolean
  showLastSeen?: boolean
  allowToAddToGroup?: boolean
}
