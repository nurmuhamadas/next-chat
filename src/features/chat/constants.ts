import {
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
    label: "My Profile",
    icon: UserIcon,
    action: "open-profile",
  },
  {
    label: "Saved Message",
    icon: BookmarkIcon,
    action: "open-saved-message",
  },
  {
    label: "Light Mode",
    icon: SunIcon,
    action: "switch-to-light",
  },
  {
    label: "Dark Mode",
    icon: MoonStarIcon,
    action: "switch-to-dark",
  },
  {
    label: "Blocked Users",
    icon: UserXIcon,
    action: "open-blocked-user",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    action: "open-settings",
  },
  {
    label: "Report a Bug",
    icon: BugIcon,
    action: "report-bug",
  },
  {
    label: "About Next Chat",
    icon: InfoIcon,
    action: "open-about",
  },
  {
    label: "Logout",
    icon: LogOutIcon,
    action: "logout",
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
