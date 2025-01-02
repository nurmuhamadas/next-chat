import { useQueryClient } from "@tanstack/react-query"
import { UserSquare2Icon } from "lucide-react"

import Loading from "@/components/loader"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useEditChannelPanel } from "@/features/channel/hooks/use-edit-channel-panel"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { useScopedI18n } from "@/lib/locale/client"

import useGetChannelById from "../hooks/api/use-get-channel-by-id"
import useGetChannelSubscribers from "../hooks/api/use-get-channel-subscribers"
import useUpdateChannel from "../hooks/api/use-update-channel"
import { useChannelAdminsPanel } from "../hooks/use-channel-admins-panel"

import ChannelForm from "./channel-form"

const EditChannelPanel = () => {
  const queryClient = useQueryClient()

  const t = useScopedI18n("channel")

  const type = useRoomType()
  const id = useRoomId()

  const { isEditChannelOpen, closeEditChannel } = useEditChannelPanel()
  const { openChannelAdmins } = useChannelAdminsPanel()

  const { mutate: updateChannel, isPending } = useUpdateChannel()

  const {
    data: channel,
    isLoading: isDataLoading,
    refetch,
  } = useGetChannelById({
    id: isEditChannelOpen && type === "channel" ? id : undefined,
  })

  const isChannelAdmin = channel?.isAdmin ?? false
  const isLoading = isDataLoading

  const { data: subscribers, isLoading: loadingSubs } =
    useGetChannelSubscribers({
      channelId: isEditChannelOpen && type === "channel" ? id : undefined,
    })
  const admins = subscribers.filter((member) => member.isAdmin)

  return (
    <RightPanelWrapper
      title={t("edit.title")}
      isOpen={isEditChannelOpen}
      onBack={closeEditChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        {isLoading ? (
          <Loading />
        ) : isChannelAdmin ? (
          <>
            <ChannelForm
              initialImageUrl={channel?.imageUrl ?? ""}
              initialValues={{
                name: channel?.name,
                type: channel?.type,
                description: channel?.description ?? "",
              }}
              isLoading={isPending}
              onSubmit={(form) => {
                updateChannel(
                  { form, param: { channelId: id } },
                  {
                    onSuccess() {
                      refetch()
                      queryClient.invalidateQueries({ queryKey: ["rooms"] })
                      closeEditChannel()
                    },
                  },
                )
              }}
            />
            <Separator className="mb-6 mt-8" />
            <ul className="">
              <li className="">
                <button
                  className="flex w-full items-center gap-x-5 rounded px-1.5 py-3 hover:bg-grey-4 focus:outline-none"
                  onClick={openChannelAdmins}
                >
                  <UserSquare2Icon className="size-7 shrink-0 text-grey-3" />
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    {loadingSubs ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-1/2" />
                      </>
                    ) : (
                      <>
                        <div className="subtitle-1">Administrator</div>
                        <p className="text-muted-foreground body-2">
                          {admins.length}
                        </p>
                      </>
                    )}
                  </div>
                </button>
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </RightPanelWrapper>
  )
}

export default EditChannelPanel
