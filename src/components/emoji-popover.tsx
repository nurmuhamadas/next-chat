import { PropsWithChildren } from "react"

import dynamic from "next/dynamic"

import { EmojiClickData } from "emoji-picker-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mb-4 w-max p-0">
        <EmojiPicker onEmojiClick={onSelectEmoji} />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPopover
