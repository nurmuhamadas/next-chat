import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useEditChannelModal } from "@/features/group/hooks/use-edit-channel-modal"
import useWindowSize from "@/hooks/use-window-size"

import ChannelForm from "./channel-form"

const EditChannelModal = () => {
  const { width } = useWindowSize()

  const { isEditChannelOpen, closeEditChannel } = useEditChannelModal()

  if (width < 600) {
    return (
      <Sheet open={isEditChannelOpen} onOpenChange={closeEditChannel}>
        <SheetContent side="bottom">
          <SheetHeader className="py-4">
            <SheetTitle className="text-center h2">Edit Channel</SheetTitle>
          </SheetHeader>

          <ChannelForm />
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Dialog open={isEditChannelOpen} onOpenChange={closeEditChannel}>
      <DialogContent>
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center h2">Edit Channel</DialogTitle>
        </DialogHeader>

        <ChannelForm />
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal
