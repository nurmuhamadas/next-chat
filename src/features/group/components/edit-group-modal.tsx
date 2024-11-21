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

import { useEditGroupModal } from "../hooks/use-edit-group-modal"

import GroupForm from "./group-form"

const EditGroupModal = () => {
  const { width } = useWindowSize()

  const { isEditGroupOpen, closeEditGroup } = useEditGroupModal()

  if (width < 600) {
    return (
      <Sheet open={isEditGroupOpen} onOpenChange={closeEditGroup}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Edit Group</SheetTitle>
          </SheetHeader>

          <GroupForm />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isEditGroupOpen} onOpenChange={closeEditGroup}>
      <DialogContent>
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center h2">Edit Group</DialogTitle>
        </DialogHeader>

        <GroupForm />
      </DialogContent>
    </Dialog>
  )
}

export default EditGroupModal
