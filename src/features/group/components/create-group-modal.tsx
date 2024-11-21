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

import { useCreateGroupModal } from "../hooks/use-create-group-modal"

import GroupForm from "./group-form"

const CreateGroupModal = () => {
  const { width } = useWindowSize()

  const { isCreateGroupOpen, closeCreateGroup } = useCreateGroupModal()

  if (width < 600) {
    return (
      <Sheet open={isCreateGroupOpen} onOpenChange={closeCreateGroup}>
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
    <Dialog open={isCreateGroupOpen} onOpenChange={closeCreateGroup}>
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
