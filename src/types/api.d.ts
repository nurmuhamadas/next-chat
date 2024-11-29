declare interface ErrorResponse {
  success: false
  error: {
    message: string
    path?: (string | number)[]
  }
}

declare type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | ErrorResponse

// AUTH API
declare type RegisterResponse = ApiResponse<boolean>

declare type LoginResponse = ApiResponse<boolean>

declare type ForgotPasswordResponse = ApiResponse<boolean>

declare type ResetPasswordResponse = ApiResponse<boolean>

declare type VerifyOTPResponse = ApiResponse<boolean>

declare type LogoutResponse = ApiResponse<boolean>

// USER API
declare type CheckUsernameResponse = ApiResponse<boolean>

declare type CreateUserProfileResponse = ApiResponse<User>

declare type PatchUserProfileResponse = ApiResponse<User>

declare type GetUserProfileResponse = ApiResponse<User>

declare type SearchUsersResponse = ApiResponse<
  {
    id: string
    name: string
    imageUrl?: string
    lastSeenAt: Date
  }[]
>

declare type GetUserLastSeenResponse = ApiResponse<string>

declare type UpdateUserLastSeenResponse = ApiResponse<string>

// BLOCKED USERS
declare type GetBlockedUsersResponse = ApiResponse<BlockedUser[]>

declare type BlockUserResponse = ApiResponse<{ id: string }>

declare type UnblockUserResponse = ApiResponse<{ id: string }>

// GROUP API
declare type CreateGroupResponse = ApiResponse<Group>

declare type PatchGroupResponse = ApiResponse<Group>

declare type GetGroupResponse = ApiResponse<Group>

declare type GetGroupMembersResponse = ApiResponse<GroupMember[]>

declare type SearchGroupsResponse = ApiResponse<
  {
    id: string
    name: string
    imageUrl?: string
    totalMember: number
  }[]
>

declare type DeleteGroupResponse = ApiResponse<{ id: string }>

declare type GetGroupMessagesResponse = ApiResponse<Message[]>

declare type MarkGroupMessagesAsReadResponse = ApiResponse<boolean>

declare type JoinGroupResponse = ApiResponse<boolean>

declare type LeaveGroupResponse = ApiResponse<boolean>

declare type AddGroupMemberResponse = ApiResponse<boolean>

declare type KickGroupMemberResponse = ApiResponse<boolean>

declare type SetAdminGroupResponse = ApiResponse<boolean>

// CHANNEL API
declare type CreateChannelResponse = ApiResponse<Channel>

declare type PatchChannelResponse = ApiResponse<Channel>

declare type GetChannelResponse = ApiResponse<Channel>

declare type GetChannelSubscribersResponse = ApiResponse<ChannelSubscriber[]>

declare type SearchChannelsResponse = ApiResponse<
  {
    id: string
    name: string
    imageUrl?: string
    totalSubscribers: number
  }[]
>

declare type DeleteChannelResponse = ApiResponse<{ id: string }>

declare type GetChannelMessagesResponse = ApiResponse<Message[]>

declare type MarkChannelMessagesAsReadResponse = ApiResponse<boolean>

declare type JoinChannelResponse = ApiResponse<boolean>

declare type LeaveChannelResponse = ApiResponse<boolean>

declare type SetAdminChannelResponse = ApiResponse<boolean>

// CONVERSATION API
/** Include groups and channels chat */
declare type GetConversationListResponse = ApiResponse<Conversation[]>

declare type DeleteConversationResponse = ApiResponse<{ id: string }>

declare type GetPrivateMessagesResponse = ApiResponse<Message[]>

declare type MarkConversationMessagesAsReadResponse = ApiResponse<boolean>

// MESSAGE API
declare type CreateMessageResponse = ApiResponse<Message>

declare type UpdateMessageResponse = ApiResponse<Message>

declare type DeleteMessageResponse = ApiResponse<{ id: string }>

// SETTINGS API
declare type GetSettingResponse = ApiResponse<Setting>

declare type MuteNotificationResponse = ApiResponse<boolean>
