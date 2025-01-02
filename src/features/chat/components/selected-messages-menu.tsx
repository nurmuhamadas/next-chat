import { CopyIcon, ForwardIcon, TrashIcon, XIcon } from "lucide-react"

import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { useScopedI18n } from "@/lib/locale/client"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

const SelectedMessageMenu = () => {
  const t = useScopedI18n("messages.select")

  const { selectedMessageIds, cancelSelectMessage } = useSelectedMessageIds()

  return (
    <div className="mb-4 mt-2 flex w-full max-w-[600px] items-center gap-x-2 rounded-lg bg-surface p-2">
      <Button variant="icon" size="icon" onClick={cancelSelectMessage}>
        <XIcon />
      </Button>
      <p className="line-clamp-1 flex-1 font-semibold">
        {t("count", { count: selectedMessageIds.length })}
      </p>
      <div className="gap-x-1 flex-center-end">
        <SimpleTooltip content={t("tooltip.forward")}>
          <Button variant="icon" size="icon" onClick={() => {}}>
            <ForwardIcon />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content={t("tooltip.copy")}>
          <Button variant="icon" size="icon" onClick={() => {}}>
            <CopyIcon />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content={t("tooltip.delete")}>
          <Button
            variant="icon"
            size="icon"
            className="text-error"
            onClick={() => {}}
          >
            <TrashIcon />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  )
}

export default SelectedMessageMenu
