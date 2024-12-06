import { LoaderIcon } from "lucide-react"

const Loading = () => {
  return (
    <div className="size-full min-h-48 flex-center">
      <LoaderIcon className="size-6 animate-spin" />
    </div>
  )
}

export default Loading
