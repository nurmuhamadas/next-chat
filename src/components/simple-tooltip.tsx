import { PropsWithChildren } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SimpleTooltipProps extends PropsWithChildren {
  content: string
  asChild?: boolean
}
const SimpleTooltip = ({
  children,
  asChild = true,
  content,
}: SimpleTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default SimpleTooltip
