"use client"

import { MenuIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBlockedUsersPanel } from "@/features/user/hooks/use-blocked-users-panel"
import { useMyProfilePanel } from "@/features/user/hooks/use-my-profile-panel"
import { useSettingsPanel } from "@/features/user/hooks/use-settings-panel"
import { cn } from "@/lib/utils"

import { MAIN_MENU } from "../constants"

const MainMenu = () => {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const { openMyProfile } = useMyProfilePanel()
  const { openBlockedUsers } = useBlockedUsersPanel()
  const { openSettings } = useSettingsPanel()

  const handleMenuClick = (action: MainMenuAction) => {
    switch (action) {
      case "open-profile":
        openMyProfile()
        break
      case "open-saved-message":
        break
      case "switch-to-light":
        setTheme("light")
        break
      case "switch-to-dark":
        setTheme("dark")
        break
      case "open-blocked-user":
        openBlockedUsers()
        break
      case "open-settings":
        openSettings()
        break
      case "report-bug":
        break
      case "open-about":
        break
      case "logout":
        break
      default:
        break
    }
  }

  const fixedMenu = MAIN_MENU.filter((menu) => {
    if (menu.action === "switch-to-dark") {
      return !isDarkMode
    }
    if (menu.action === "switch-to-light") {
      return isDarkMode
    }

    return true
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button size="icon" variant="icon" className="shrink-0">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="min-w-52">
        {fixedMenu.map((menu) => {
          return (
            <DropdownMenuItem
              key={menu.label}
              className={cn(
                "py-2.5 body-2",
                menu.action === "logout" && "text-error hover:!text-error",
              )}
              onClick={() => handleMenuClick(menu.action)}
            >
              <menu.icon
                className={cn(
                  "size-[18px] text-grey-3",
                  menu.action === "logout" && "text-error",
                )}
              />{" "}
              {menu.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MainMenu
