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

import GroupForm from "./group-form"

interface CreateGroupModalProps {
  open: boolean
  onOpenChange(value: boolean): void
}

const CreateGroupModal = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const { width } = useWindowSize()

  if (width < 600) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Create Group</SheetTitle>
          </SheetHeader>

          <GroupForm />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center h2">Create Group</DialogTitle>
        </DialogHeader>

        <GroupForm />
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupModal
