import {
  BookmarkIcon,
  BugIcon,
  InfoIcon,
  LogOutIcon,
  LucideIcon,
  MoonStarIcon,
  SettingsIcon,
  SunIcon,
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
