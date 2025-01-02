import {
  ArchiveIcon,
  BellIcon,
  BellOffIcon,
  BookmarkIcon,
  BugIcon,
  CircleCheckIcon,
  CopyIcon,
  ForwardIcon,
  InfoIcon,
  LogOutIcon,
  LucideIcon,
  MoonStarIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  ReplyIcon,
  SettingsIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  UserXIcon,
} from "lucide-react"

export const MAIN_MENU: {
  label: string
  icon: LucideIcon
  action: MainMenuAction
}[] = [
  {
    label: "my_profile" as const,
    icon: UserIcon,
    action: "open-profile",
  },
  {
    label: "saved_messages" as const,
    icon: BookmarkIcon,
    action: "open-saved-message",
  },
  {
    label: "light_mode" as const,
    icon: SunIcon,
    action: "switch-to-light",
  },
  {
    label: "dark_mode" as const,
    icon: MoonStarIcon,
    action: "switch-to-dark",
  },
  {
    label: "bloked_users" as const,
    icon: UserXIcon,
    action: "open-blocked-user",
  },
  {
    label: "settings" as const,
    icon: SettingsIcon,
    action: "open-settings",
  },
  {
    label: "report_bug" as const,
    icon: BugIcon,
    action: "report-bug",
  },
  {
    label: "about_us" as const,
    icon: InfoIcon,
    action: "open-about",
  },
  {
    label: "logout" as const,
    icon: LogOutIcon,
    action: "logout",
  },
]

export const chatRoomListMenu: {
  label: string
  icon: LucideIcon
  danger?: boolean
  action: ChatRoomListMenuAction
}[] = [
  {
    label: "Pin to top",
    icon: PinIcon,
    action: "pin",
  },
  {
    label: "Unpin from top",
    icon: PinOffIcon,
    action: "unpin",
  },
  {
    label: "Archive",
    icon: ArchiveIcon,
    action: "archive",
  },
  {
    label: "Delete",
    icon: TrashIcon,
    danger: true,
    action: "delete",
  },
]

export const chatRoomPrivateMenu: {
  label: string
  icon: LucideIcon
  danger?: boolean
  action: ChatRoomPrivateMenuAction
}[] = [
  {
    label: "Mute",
    icon: BellOffIcon,
    action: "mute-chat",
  },
  {
    label: "Unmute",
    icon: BellIcon,
    action: "unmute-chat",
  },
  {
    label: "Block User",
    icon: UserXIcon,
    action: "block-user",
  },
  {
    label: "Unblock User",
    icon: UserIcon,
    action: "unblock-user",
  },
  {
    label: "Delete Chat",
    icon: TrashIcon,
    danger: true,
    action: "delete-chat",
  },
]

export const chatRoomGroupMenu: {
  label: string
  icon: LucideIcon
  danger?: boolean
  action: ChatRoomGroupMenuAction
}[] = [
  {
    label: "Mute",
    icon: BellOffIcon,
    action: "mute-group",
  },
  {
    label: "Unmute",
    icon: BellIcon,
    action: "unmute-group",
  },
  {
    label: "Leave Group",
    icon: LogOutIcon,
    action: "leave-group",
  },
  {
    label: "Delete Chat",
    icon: TrashIcon,
    danger: true,
    action: "delete-chat",
  },
]

export const chatRoomChannelMenu: {
  label: string
  icon: LucideIcon
  danger?: boolean
  action: ChatRoomChannelMenuAction
}[] = [
  {
    label: "Mute",
    icon: BellOffIcon,
    action: "mute-channel",
  },
  {
    label: "Unmute",
    icon: BellIcon,
    action: "unmute-channel",
  },
  {
    label: "Leave Channel",
    icon: LogOutIcon,
    action: "leave-channel",
  },
  {
    label: "Delete Chat",
    icon: TrashIcon,
    danger: true,
    action: "delete-chat",
  },
]

export const messageItemMenu: {
  label: string
  icon: LucideIcon
  danger?: boolean
  action: MessageItemMenuAction
}[] = [
  {
    label: "Reply",
    icon: ReplyIcon,
    action: "reply",
  },
  {
    label: "Edit",
    icon: PencilIcon,
    action: "edit",
  },
  {
    label: "Copy Text",
    icon: CopyIcon,
    action: "copy-text",
  },
  // {
  //   label: "Pin",
  //   icon: PinIcon,
  //   action: "pin",
  // },
  {
    label: "Forward",
    icon: ForwardIcon,
    action: "forward",
  },
  {
    label: "Select",
    icon: CircleCheckIcon,
    action: "select",
  },
  {
    label: "Delete",
    icon: TrashIcon,
    action: "delete",
    danger: true,
  },
]
