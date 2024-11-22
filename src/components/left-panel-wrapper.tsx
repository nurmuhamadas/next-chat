import { PropsWithChildren, ReactNode } from "react"

import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface LeftPanelWrapperProps extends PropsWithChildren {
  title: string
  isOpen: boolean
  onBack(): void
  action?: ReactNode
}

const LeftPanelWrapper = ({
  title,
  isOpen,
  children,
  onBack,
  action,
}: LeftPanelWrapperProps) => {
  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="left"
        className="w-screen max-w-[450px] p-0 sm:max-w-[450px] md:max-w-[384px]"
        overlayClassName="md:hidden"
      >
        <SheetHeader className="hidden">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="relative flex size-full flex-col bg-surface pt-14">
          <div className="absolute left-0 top-0 h-14 w-full gap-x-4 p-2 flex-center-between">
            <div className="flex items-center gap-x-4">
              <Button variant="icon" size="icon" onClick={onBack}>
                <ArrowLeftIcon />
              </Button>
              <h3 className="line-clamp-1 h3">{title}</h3>
            </div>

            {action && <div className="gap-x-1 flex-center-end">{action}</div>}
          </div>

          <ScrollArea className="chat-list-scroll-area">{children}</ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default LeftPanelWrapper
