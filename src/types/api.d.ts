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

declare type ApiCollectionResponse<T> =
  | {
      success: true
      data: T[]
      total: number
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

declare type GetMyProfileResponse = ApiResponse<User>

declare type SearchUsersResponse = ApiCollectionResponse<UserSearch>

declare type GetUserLastSeenResponse = ApiResponse<string | null>

declare type UpdateUserLastSeenResponse = ApiResponse<string>

// BLOCKED USERS
declare type GetBlockedUsersResponse = ApiResponse<BlockedUser[]>

declare type BlockUserResponse = ApiResponse<{ id: string }>

declare type UnblockUserResponse = ApiResponse<{ id: string }>

// GROUP API
declare type CreateGroupResponse = ApiResponse<Group>

declare type PatchGroupResponse = ApiResponse<Group>

declare type GetGroupsResponse = ApiCollectionResponse<Group>

declare type GetGroupResponse = ApiResponse<Group>

declare type GetGroupMembersResponse = ApiResponse<GroupMember[]>

declare type SearchGroupsResponse = ApiCollectionResponse<GroupSearch>

// TODO:
declare type DeleteGroupResponse = ApiResponse<{ id: string }>

// TODO:
declare type GetGroupMessagesResponse = ApiResponse<Message[]>

// TODO:
declare type MarkGroupMessagesAsReadResponse = ApiResponse<boolean>

declare type JoinGroupResponse = ApiResponse<boolean>

declare type LeaveGroupResponse = ApiResponse<boolean>

declare type AddGroupMemberResponse = ApiResponse<boolean>

declare type KickGroupMemberResponse = ApiResponse<boolean>

declare type SetAdminGroupResponse = ApiResponse<boolean>

declare type UnsetAdminGroupResponse = ApiResponse<boolean>

// CHANNEL API
declare type CreateChannelResponse = ApiResponse<Channel>

declare type PatchChannelResponse = ApiResponse<Channel>

declare type GetChannelsResponse = ApiCollectionResponse<Channel>

declare type GetChannelResponse = ApiResponse<Channel>

declare type GetChannelSubscribersResponse = ApiResponse<ChannelSubscriber[]>

declare type SearchChannelsResponse = ApiCollectionResponse<ChannelSearch>

// TODO:
declare type DeleteChannelResponse = ApiResponse<{ id: string }>

// TODO:
declare type GetChannelMessagesResponse = ApiResponse<Message[]>

// TODO:
declare type MarkChannelMessagesAsReadResponse = ApiResponse<boolean>

declare type JoinChannelResponse = ApiResponse<boolean>

declare type LeaveChannelResponse = ApiResponse<boolean>

declare type SetAdminChannelResponse = ApiResponse<boolean>

declare type UnsetAdminChannelResponse = ApiResponse<boolean>

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
