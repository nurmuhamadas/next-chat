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
import useWindowSize from "@/hooks/useWindowSize"

import ChannelForm from "./channel-form"

interface CreateChannelModalProps {
  open: boolean
  onOpenChange(value: boolean): void
}

const CreateChannelModal = ({
  open,
  onOpenChange,
}: CreateChannelModalProps) => {
  const { width } = useWindowSize()

  if (width < 600) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
