declare type RoomType = "chat" | "group" | "channel"

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

declare type ChatRoomMenuAction =
  | "mute-chat"
  | "block-user"
  | "delete-chat"
  | "mute-group"
  | "leave-group"
  | "delete-and-exit-group"
  | "mute-channel"
  | "leave-channel"
  | "delete-and-exit-channel"

declare type ChannelType = "PUBLIC" | "PRIVATE"

declare type GroupType = "PUBLIC" | "PRIVATE"

declare type Gender = "MALE" | "FEMALE"

declare type Theme = "LIGHT" | "DARK" | "SYSTEM"

declare type TimeFormat = "12-HOURS" | "24-HOURS"

declare type Language = "EN" | "ID"
