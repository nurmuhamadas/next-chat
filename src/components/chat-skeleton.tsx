import { Skeleton } from "./ui/skeleton"

const ChatSkeleton = ({ rows = 3 }: { rows?: number }) => {
  const skeleton = (
    <div className="flex items-center gap-x-3 rounded-lg p-1.5 px-3">
      <Skeleton className="size-10 rounded-full" />

      <div className="flex flex-1 flex-col gap-y-2 overflow-hidden">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )

  const skeletons = []
  for (let i = 0; i < rows; i++) {
    skeletons.push(skeleton)
  }

  return <div className="flex flex-col gap-y-2">{...skeletons}</div>
}

export default ChatSkeleton
