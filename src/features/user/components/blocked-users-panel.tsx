import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import ChatSkeleton from "@/components/chat-skeleton"
import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { Button } from "@/components/ui/button"
import useGetBlockedUsers from "@/features/blocked-users/hooks/api/use-get-blocked-users"
import useUnblockUser from "@/features/blocked-users/hooks/api/use-unblock-user"
import { useScopedI18n } from "@/lib/locale/client"

import { useBlockedUsersPanel } from "../hooks/use-blocked-users-panel"

const BlockedUsersPanel = () => {
  const queryClient = useQueryClient()

  const t = useScopedI18n("blocked_user")

  const { isBlockedUsersOpen, closeBlockedUsers } = useBlockedUsersPanel()

  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser()

  const {
    data: blockedUsers,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetBlockedUsers({ enabled: isBlockedUsersOpen })

  const handleUnblockUser = async (id: string) => {
    unblockUser(
      { blockedUserId: id },
      {
        onSuccess(data) {
          refetch()
          queryClient.invalidateQueries({
            queryKey: ["get-is-blocked-user", data.id],
          })
        },
      },
    )
  }

  return (
    <LeftPanelWrapper
      isOpen={isBlockedUsersOpen}
      title={t("title")}
      onBack={closeBlockedUsers}
    >
      {isLoading && blockedUsers.length === 0 && <ChatSkeleton />}

      {!isLoading && blockedUsers.length === 0 && (
        <div className="size-full pt-8 flex-col-center">
          <p className="text-muted-foreground">{t("no_data")}</p>
        </div>
      )}

      {!isLoading && blockedUsers.length > 0 && (
        <ul className="flex flex-col px-1.5 pt-2">
          {blockedUsers.map((user) => {
            return (
              <li
                key={user.id}
                className="flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-background/50"
              >
                <ChatAvatar
                  src={user.imageUrl ?? ""}
                  name={user.name}
                  className="size-[54px]"
                />
                <p className="line-clamp-1 flex-1 subtitle-1">{user.name}</p>
                <Button
                  variant="outline"
                  onClick={() => handleUnblockUser(user.id)}
                  disabled={isUnblocking}
                >
                  Unblock
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {isLoading && blockedUsers.length > 0 && (
        <div className="h-24 flex-center">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      )}

      {!isLoading && hasNextPage && (
        <Button variant="link" onClick={() => fetchNextPage()}>
          Show more
        </Button>
      )}
    </LeftPanelWrapper>
  )
}

export default BlockedUsersPanel
