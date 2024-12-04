declare interface AppwriteDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
}

declare interface UserAWModel extends AppwriteDocument, UserModel {
  lastSeenAt?: string
}
declare interface UserModel {
  email: string
  firstName: string
  lastName?: string
  username: string
  gender: Gender
  bio?: string
  imageUrl?: string
  lastSeenAt?: Date
}

declare interface ConversationAWModel
  extends AppwriteDocument,
    ConversationModel {}
declare interface ConversationModel {
  userId1: string
  userId2: string
  lastMessageId?: string
}

declare interface ConversationOptionAWModel
  extends AppwriteDocument,
    ConversationOptionModel {
  deletedAt?: Date
}
declare interface ConversationOptionModel {
  conversationId: string
  userId: string
  notification: boolean
  deletedAt?: string
}

declare interface BlockedUserAWModel
  extends AppwriteDocument,
    BlockedUserModel {}
declare interface BlockedUserModel {
  userId: string
  blockedUserId: string
}

declare interface MessageAWModel extends AppwriteDocument, MessageModel {
  updatedAt?: Date
}
declare interface MessageModel {
  message?: string
  userId: string
  conversationId?: string
  parentMessageId?: string
  parentMessageName?: string
  parentMessageText?: string
  groupId?: string
  channelId?: string
  originalMessageId?: string
  isEmojiOnly: boolean
  status: MessageStatus
  updatedAt?: string
}

declare interface MessageReadAWModel
  extends AppwriteDocument,
    MessageReadModel {}
declare interface MessageReadModel {
  userId: string
  messageId: string
}

declare interface ReactionAWModel extends AppwriteDocument, ReactionModel {}
declare interface ReactionModel {
  reaction: string
  messageId: string
  userId: string
}

declare interface AttachmentAWModel extends AppwriteDocument, AttachmentModel {}
declare interface AttachmentModel {
  url: string
  name: string
  type: AttachmentType
  size: number
  messageId: string
}

declare interface GroupAWModel extends AppwriteDocument, GroupModel {}
declare interface GroupModel {
  name: string
  description?: string
  type: GroupType
  imageUrl?: string
  ownerId: string
  inviteCode: string
  lastMessageId?: string
}

declare interface GroupOptionAWModel
  extends AppwriteDocument,
    GroupOptionModel {}
declare interface GroupOptionModel {
  groupId: string
  userId: string
  notification: boolean
}

declare interface GroupMemberAWModel
  extends AppwriteDocument,
    GroupMemberModel {
  joinedAt: string
  leftAt?: string
}
declare interface GroupMemberModel {
  groupId: string
  userId: string
  joinedAt: Date
  leftAt?: Date
  isAdmin: boolean
}

declare interface ChannelAWModel extends AppwriteDocument, ChannelModel {}
declare interface ChannelModel {
  name: string
  description?: string
  type: ChannelType
  ownerId: string
  imageUrl?: string
  inviteCode: string
  lastMessageId?: string
}

declare interface ChannelSubscriberAWModel
  extends AppwriteDocument,
    ChannelSubscriberModel {}
declare interface ChannelSubscriberModel {
  channelId: string
  userId: string
  subscribedAt: string
  unsubscribedAt?: string
  isAdmin: boolean
}

declare interface ChannelOptionAWModel
  extends AppwriteDocument,
    ChannelOptionModel {}
declare interface ChannelOptionModel {
  channelId: string
  userId: string
  notification: boolean
}

declare interface SettingAWModel extends AppwriteDocument, SettingModel {}
declare interface SettingModel {
  userId: string
  timeFormat?: TimeFormat
  language?: Language
  notifications?: NotificationType[]
  enable2FA?: boolean
  showLastSeen?: boolean
  allowToAddToGroup?: boolean
}
