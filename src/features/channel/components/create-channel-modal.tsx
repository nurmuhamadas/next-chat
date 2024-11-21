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
import useWindowSize from "@/hooks/use-window-size"

import { useCreateChannelModal } from "../hooks/use-create-channel-modal"

import ChannelForm from "./channel-form"

const CreateChannelModal = () => {
  const { width } = useWindowSize()

  const { isCreateChannelOpen, closeCreateChannel } = useCreateChannelModal()

  if (width < 600) {
    return (
      <Sheet open={isCreateChannelOpen} onOpenChange={closeCreateChannel}>
        <SheetContent side="bottom">
          <SheetHeader className="py-4">
            <SheetTitle className="text-center h2">Create Channel</SheetTitle>
          </SheetHeader>

          <ChannelForm />
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Dialog open={isCreateChannelOpen} onOpenChange={closeCreateChannel}>
      <DialogContent>
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center h2">Create Channel</DialogTitle>
        </DialogHeader>

        <ChannelForm />
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
