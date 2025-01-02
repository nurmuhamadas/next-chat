import { PropsWithChildren } from "react"

import dynamic from "next/dynamic"

import { EmojiClickData } from "emoji-picker-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useScopedI18n } from "@/lib/locale/client"

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: false },
)

interface EmojiPopoverProps extends PropsWithChildren {
  onSelectEmoji(emoji: EmojiClickData, event: MouseEvent): void
}

const EmojiPopover = ({ children, onSelectEmoji }: EmojiPopoverProps) => {
  const t = useScopedI18n("messages.tooltip")

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{t("emoji")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="mb-4 w-max p-0">
        <EmojiPicker onEmojiClick={onSelectEmoji} />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPopover
