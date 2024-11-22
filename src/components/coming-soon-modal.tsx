import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useComingSoonFeature } from "@/hooks/use-coming-soon-feature"

const ComingSoonModal = () => {
  const { comingSoonInfoOpen, closeComingSoonInfo } = useComingSoonFeature()

  return (
    <AlertDialog open={comingSoonInfoOpen} onOpenChange={closeComingSoonInfo}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ups.. Sorry!</AlertDialogTitle>
          <AlertDialogDescription>
            This feature is not availabel right now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ComingSoonModal
