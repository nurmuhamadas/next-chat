declare type RoomType = "chat" | "group" | "channel"

declare type RoomTypeModelLower = "private" | "group" | "channel"

declare type MainMenuAction =
  | "open-profile"
  | "open-saved-message"
  | "switch-to-light"
  | "switch-to-dark"
  | "open-blocked-user"
  | "open-settings"
  | "report-bug"
  | "open-about"
  | "logout"

declare type ChatRoomPrivateMenuAction =
  | "mute-chat"
  | "unmute-chat"
  | "block-user"
  | "unblock-user"
  | "delete-chat"

declare type ChatRoomGroupMenuAction =
  | "mute-group"
  | "unmute-group"
  | "leave-group"
  | "delete-chat"

declare type ChatRoomChannelMenuAction =
  | "mute-channel"
  | "unmute-channel"
  | "leave-channel"
  | "delete-chat"

declare type ChatRoomListMenuAction = "pin" | "unpin" | "archive" | "delete"

declare type MessageItemMenuAction =
  | "reply"
  | "edit"
  | "copy-text"
  | "pin"
  | "forward"
  | "select"
  | "delete"
