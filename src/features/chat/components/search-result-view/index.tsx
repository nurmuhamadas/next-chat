import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locale/client"

import SearchChannelResult from "./channel"
import SearchGroupResult from "./group"
import SearchUserResult from "./user"

const SearchResultView = () => {
  const t = useScopedI18n("room.search")

  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue="user" className="w-full flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="user" className="flex-1">
            {t("users.title")}
          </TabsTrigger>
          <TabsTrigger value="group" className="flex-1">
            {t("groups.title")}
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex-1">
            {t("channels.title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="flex max-h-[calc(100vh-96px)]">
          <ScrollArea className="chat-list-scroll-area max-h-full w-full">
            <SearchUserResult />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="group" className="flex max-h-[calc(100vh-96px)]">
          <ScrollArea className="chat-list-scroll-area max-h-full w-full">
            <SearchGroupResult />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="channel" className="flex max-h-[calc(100vh-96px)]">
          <ScrollArea className="chat-list-scroll-area max-h-full w-full">
            <SearchChannelResult />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SearchResultView
