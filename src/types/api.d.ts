declare interface SessionToken {
  userId: string
  username: string
  deviceId: string
  email: string
  userAgent: string
  isProfileComplete: boolean
}

declare interface UserSession {
  id: string
  token: string
  userId: string
  username: string
  deviceId: string
  email: string
  isProfileComplete: boolean
}

declare interface ApiError {
  message: string
  path?: (string | number)[]
}

declare interface ErrorResponse {
  success: false
  error: ApiError
}

declare type InferResponse<T> = T extends ApiResponse<infer U> ? U : never

declare type ApiResponse<T> = {
  success: true
  data: T
}

declare type ApiCollectionResponse<T> = {
  success: true
  data: T[]
  total: number
  cursor?: string
}

// AUTH API
declare type SignUpResponse = ApiResponse<{ username: string; email: string }>

declare type SignInResponse = ApiResponse<{
  status: "unverified" | "2fa" | "success"
}>

declare type EmailVerificationResponse = ApiResponse<{ email: string }>

declare type EmailLoginResponse = ApiResponse<{ email: string }>

declare type EmailPasswordResetResponse = ApiResponse<{ email: string }>

declare type ResetPasswordResponse = ApiResponse<boolean>

declare type VerifyEmailResponse = ApiResponse<boolean>

declare type LogoutResponse = ApiResponse<boolean>

// USER API
declare type UsernameAvailabilityResponse = ApiResponse<boolean>

declare type CreateUserProfileResponse = ApiResponse<Profile>

declare type PatchUserProfileResponse = ApiResponse<Profile>

declare type GetUserProfileResponse = ApiResponse<Profile>

declare type GetMyProfileResponse = ApiResponse<Profile>

declare type SearchUsersResponse = ApiCollectionResponse<UserSearch>

declare type SearchUsersForMemberResponse =
  ApiCollectionResponse<UserSearchForMember>

declare type GetUserLastSeenResponse = ApiResponse<string | null>

declare type UpdateUserLastSeenResponse = ApiResponse<string>

// BLOCKED USERS
declare type GetBlockedUsersResponse = ApiCollectionResponse<BlockedUser>

declare type GetIsBlockedUserResponse = ApiResponse<boolean>

declare type BlockUserResponse = ApiResponse<{ id: string }>

declare type UnblockUserResponse = ApiResponse<{ id: string }>

// PRIVATE CHAT API
declare type GetPrivateChatOptionResponse = ApiResponse<PrivateChatOption>

declare type UpdatePrivateChatOptionResponse = ApiResponse<PrivateChatOption>

declare type DeleteAllPrivateChatResponse = ApiResponse<boolean>

// GROUP API
declare type CreateGroupResponse = ApiResponse<Group>

declare type PatchGroupResponse = ApiResponse<Group>

declare type GetGroupsResponse = ApiCollectionResponse<Group>

declare type GetNameAvailabilityResponse = ApiResponse<boolean>

declare type GetGroupResponse = ApiResponse<Group>

declare type GetGroupMembersResponse = ApiCollectionResponse<GroupMember>

declare type SearchPublicGroupsResponse = ApiCollectionResponse<GroupSearch>

declare type DeleteGroupResponse = ApiResponse<{ id: string }>

declare type JoinGroupResponse = ApiResponse<boolean>

declare type LeaveGroupResponse = ApiResponse<boolean>

declare type AddGroupMemberResponse = ApiResponse<boolean>

declare type DeleteGroupMemberResponse = ApiResponse<boolean>

declare type SetAdminGroupResponse = ApiResponse<boolean>

declare type UnsetAdminGroupResponse = ApiResponse<boolean>

declare type DeleteAllGroupChatResponse = ApiResponse<boolean>

declare type GetGroupOptionResponse = ApiResponse<GroupOption | null>

declare type UpdateGroupNotifResponse = ApiResponse<GroupOption>

// CHANNEL API
declare type CreateChannelResponse = ApiResponse<Channel>

declare type PatchChannelResponse = ApiResponse<Channel>

declare type GetChannelsResponse = ApiCollectionResponse<Channel>

declare type GetChannelResponse = ApiResponse<Channel>

declare type GetChannelSubscribersResponse =
  ApiCollectionResponse<ChannelSubscriber>

declare type SearchChannelsResponse = ApiCollectionResponse<ChannelSearch>

declare type DeleteChannelResponse = ApiResponse<{ id: string }>

declare type JoinChannelResponse = ApiResponse<boolean>

declare type LeaveChannelResponse = ApiResponse<boolean>

declare type SetAdminChannelResponse = ApiResponse<boolean>

declare type UnsetAdminChannelResponse = ApiResponse<boolean>

declare type DeleteAllChannelChatResponse = ApiResponse<boolean>

declare type GetChannelOptionResponse = ApiResponse<ChannelOption | null>

declare type UpdateChannelOptionResponse = ApiResponse<ChannelOption>

// ROOM API
/** Include groups and channels chat */
declare type GetRoomListResponse = ApiCollectionResponse<Room>

declare type GetPrivateRoomsResponse = ApiCollectionResponse<PrivateRoom>

declare type GetRoomResponse = ApiResponse<Room>

declare type DeleteRoomResponse = ApiResponse<{ id: string }>

declare type PinRoomResponse = ApiResponse<boolean>

declare type UnpinRoomResponse = ApiResponse<boolean>

declare type ArchiveRoomResponse = ApiResponse<boolean>

declare type UnarchiveRoomResponse = ApiResponse<boolean>

// MESSAGE API
declare type CreateMessageResponse = ApiResponse<Message>

declare type GetMessagesResponse = ApiCollectionResponse<Message>

declare type ForwardMessageResponse = ApiResponse<Message>

declare type UpdateMessageResponse = ApiResponse<Message>

declare type ReactMessageResponse = ApiResponse<Reaction>

declare type DeleteMessageResponse = ApiResponse<{ id: string }>

declare type MarkMessageAsReadResponse = ApiResponse<boolean>

// SETTINGS API
declare type GetSettingResponse = ApiResponse<Setting>

declare type UpdateSettingResponse = ApiResponse<Setting>
