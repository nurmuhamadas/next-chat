import { useQueryClient } from "@tanstack/react-query"

import Loading from "@/components/loader"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { useEditChannelPanel } from "@/features/channel/hooks/use-edit-channel-panel"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import useGetChannelById from "../hooks/api/use-get-channel-by-id"
import useGetIsChannelAdmin from "../hooks/api/use-get-is-channel-admin"
import useUpdateChannel from "../hooks/api/use-update-channel"

import ChannelForm from "./channel-form"

const EditChannelPanel = () => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const { isEditChannelOpen, closeEditChannel } = useEditChannelPanel()

  const { mutate: updateChannel, isPending } = useUpdateChannel()
  const {
    data: channel,
    isLoading: isDataLoading,
    refetch,
  } = useGetChannelById({
    id: type === "channel" ? id : undefined,
  })
  const { data: isChannelAdmin, isLoading: isAdminLoading } =
    useGetIsChannelAdmin({ id: type === "channel" ? id : undefined })
  const isLoading = isAdminLoading || isDataLoading

  return (
    <RightPanelWrapper
      title="Edit Channel"
      isOpen={isEditChannelOpen}
      onBack={closeEditChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        {isLoading ? (
          <Loading />
        ) : isChannelAdmin ? (
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
        ) : null}
      </div>
    </RightPanelWrapper>
  )
}

export default EditChannelPanel
