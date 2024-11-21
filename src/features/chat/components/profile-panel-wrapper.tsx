import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import ProfilePanel from "@/features/chat/components/profile-panel"
import useWindowSize from "@/hooks/useWindowSize"
import { cn } from "@/lib/utils"

import { useRoomProfile } from "../hooks/useRoomProfile"

const ProfilePanelWrapper = () => {
  const { isDesktop } = useWindowSize()
  const { roomProfileOpen, closeRoomProfile } = useRoomProfile()

  return isDesktop ? (
    <div
      className={cn(
        roomProfileOpen ? "flex-1 max-w-[384px]" : "max-w-0",
        "transition-all ease-linear duration-150 hidden lg:block border-l border-grey-1 ",
      )}
    >
      <ProfilePanel onClose={closeRoomProfile} />
    </div>
  ) : (
    <Sheet open={roomProfileOpen} onOpenChange={closeRoomProfile}>
      <SheetContent className="w-full max-w-[420px] border-none bg-surface p-0 sm:max-w-[420px]">
        <SheetHeader className="hidden">
          <SheetTitle>User name profile</SheetTitle>
        </SheetHeader>

        <ProfilePanel onClose={closeRoomProfile} />
      </SheetContent>
    </Sheet>
  )
}

export default ProfilePanelWrapper
