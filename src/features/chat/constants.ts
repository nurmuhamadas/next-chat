import {
  BellOffIcon,
  BookmarkIcon,
  BugIcon,
  InfoIcon,
  LogOutIcon,
  LucideIcon,
  MoonStarIcon,
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

export const chatRoomMenu: Record<
  RoomType,
  {
    label: string
    icon: LucideIcon
    danger?: boolean
    action: ChatRoomMenuAction
  }[]
> = {
  chat: [
    {
      label: "Mute",
      icon: BellOffIcon,
      action: "mute-chat",
    },
    {
      label: "Block User",
      icon: UserXIcon,
      action: "block-user",
    },
    {
      label: "Delete Chat",
      icon: TrashIcon,
      danger: true,
      action: "delete-chat",
    },
  ],
  group: [
    {
      label: "Mute",
      icon: BellOffIcon,
      action: "mute-group",
    },
    {
      label: "Leave Group",
      icon: LogOutIcon,
      action: "leave-group",
    },
    {
      label: "Delete and Exit",
      icon: TrashIcon,
      danger: true,
      action: "delete-and-exit-group",
    },
  ],
  channel: [
    {
      label: "Mute",
      icon: BellOffIcon,
      action: "mute-channel",
    },
    {
      label: "Leave Channel",
      icon: LogOutIcon,
      action: "leave-channel",
    },
    {
      label: "Delete and Exit",
      icon: TrashIcon,
      danger: true,
      action: "delete-and-exit-channel",
    },
  ],
}
