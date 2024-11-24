import { CopyIcon, ForwardIcon, TrashIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

const SelectedMessageMenu = () => {
  const { selectedMessageIds, cancelSelectMessage } = useSelectedMessageIds()

  return (
    <div className="mb-4 mt-2 flex w-full max-w-[600px] items-center gap-x-2 rounded-lg bg-surface p-2">
      <Button variant="icon" size="icon" onClick={cancelSelectMessage}>
        <XIcon />
      </Button>
      <p className="line-clamp-1 flex-1 font-semibold">
        {selectedMessageIds.length} message selected
      </p>
      <div className="gap-x-1 flex-center-end">
        <Button variant="icon" size="icon" onClick={() => {}}>
          <ForwardIcon />
        </Button>
        <Button variant="icon" size="icon" onClick={() => {}}>
          <CopyIcon />
        </Button>
        <Button
          variant="icon"
          size="icon"
          className="text-error"
          onClick={() => {}}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}

export default SelectedMessageMenu
