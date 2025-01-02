import { useState } from "react"

import { XIcon } from "lucide-react"

import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { useScopedI18n } from "@/lib/locale/client"
import { debounce } from "@/lib/utils"

import { useSearchQuery } from "../hooks/use-search-query"

import FloatingButton from "./floating-button"
import MainMenu from "./main-menu"
import RoomListView from "./room-list-view"
import SearchResultView from "./search-result-view"

const RoomListPanel = () => {
  const t = useScopedI18n("room.search")

  const { setSearchQuery } = useSearchQuery()

  const [isSearching, setIsSearching] = useState(false)

  return (
    <div className="group/chat-list relative flex size-full max-h-screen flex-col border-r border-grey-1 pt-[52px]">
      <div className="absolute left-0 top-0 flex w-full items-center gap-x-4 py-1.5 pl-4 pr-2.5">
        <MainMenu />

        <div className="flex flex-1 items-center gap-x-2">
          <SearchBar
            placeholder={t("placeholder")}
            onValueChange={debounce(setSearchQuery, 300)}
            onClick={() => setIsSearching(true)}
          />

          {isSearching && (
            <Button
              variant="icon"
              size="icon-sm"
              onClick={() => {
                setIsSearching(false)
                setSearchQuery("")
              }}
            >
              <XIcon />
            </Button>
          )}
        </div>
      </div>

      {isSearching ? <SearchResultView /> : <RoomListView />}

      <FloatingButton />
    </div>
  )
}

export default RoomListPanel
