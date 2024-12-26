import Link from "next/link"

import ChatAvatar from "@/components/chat-avatar"

const SearchResultItem = ({
  id,
  title,
  type,
  imageUrl,
  description,
}: {
  id: string
  title: string
  type: RoomType
  imageUrl?: string
  description?: string
}) => {
  return (
    <Link href={`/${type}/${id}`}>
      <li className="flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4">
        <ChatAvatar className="size-10" src={imageUrl} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <h4 className="flex-1 truncate h5">{title}</h4>
          <p className="flex-1 truncate text-muted-foreground body-1">
            {description}
          </p>
        </div>
      </li>
    </Link>
  )
}

export default SearchResultItem
