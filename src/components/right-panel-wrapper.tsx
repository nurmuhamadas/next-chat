"use client"

import { PropsWithChildren, ReactNode } from "react"

import { ArrowLeftIcon, XIcon } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface RightPanelWrapperProps extends PropsWithChildren {
  title: string
  isOpen: boolean
  onBack(): void
  arrowBack?: boolean
  action?: ReactNode
}

const RightPanelWrapper = ({
  title,
  isOpen,
  arrowBack,
  onBack,
  action,
  children,
}: RightPanelWrapperProps) => {
  return (
    <Sheet open={isOpen} modal={false}>
      <SheetContent
        className="w-full max-w-[420px] border-none bg-surface p-0 sm:max-w-[420px] lg:max-w-[384px]"
        overlayClassName="lg:hidden"
        hideOverlay
      >
        <SheetHeader className="hidden">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="relative flex size-full flex-col bg-surface pt-14">
          <div className="absolute left-0 top-0 h-14 w-full gap-x-4 p-2 flex-center-between">
            <div className="flex items-center gap-x-4">
              <Button variant="icon" size="icon" onClick={onBack}>
                {arrowBack ? <ArrowLeftIcon /> : <XIcon />}
              </Button>
              <h3 className="line-clamp-1 h3">{title}</h3>
            </div>

            <div className="gap-x-1 flex-center-end">{action}</div>
          </div>

          <ScrollArea className="chat-list-scroll-area">{children}</ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default RightPanelWrapper
