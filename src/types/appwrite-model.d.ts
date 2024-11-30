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
}

declare interface ConversationOptionAWModel
  extends AppwriteDocument,
    ConversationOptionModel {}
declare interface ConversationOptionModel {
  conversationId: string
  notification: boolean
}

declare interface BlockedUserAWModel
  extends AppwriteDocument,
    BlockedUserModel {}
declare interface BlockedUserModel {
  userId: string
  blockedUserId: string
}

declare interface MessageAWModel extends AppwriteDocument, MessageModel {}
declare interface MessageModel {
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
  notification: boolean
}

declare interface GroupMemberAWModel
  extends AppwriteDocument,
    GroupMemberModel {}
declare interface GroupMemberModel {
  groupId: string
  userId: string
  joinedAt: string
  leftAt?: string
  isAdmin: boolean
}

declare interface ChannelAWModel extends AppwriteDocument, ChannelModel {}
declare interface ChannelModel {
  name: string
  description?: string
  type: ChannelType
  ownerId: string
  imageUrl?: string
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
