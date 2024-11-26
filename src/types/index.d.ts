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

declare type MessageItemMenuAction =
  | "reply"
  | "edit"
  | "copy-text"
  | "pin"
  | "forward"
  | "select"
  | "delete"
