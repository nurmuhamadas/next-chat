import { Separator } from "@/components/ui/separator"

interface SettingsContainerProps extends React.PropsWithChildren {
  title: string
}

const SettingsContainer = ({ title, children }: SettingsContainerProps) => {
  return (
    <div className="flex flex-col bg-surface">
      <div className="p-4">
        <h3 className="text-muted-foreground h4">{title}</h3>
      </div>

      <Separator />

      <div className="flex flex-col gap-y-2 pb-3">{children}</div>
    </div>
  )
}

export default SettingsContainer
