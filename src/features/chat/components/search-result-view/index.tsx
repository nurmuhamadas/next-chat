import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SearchChannelResult from "./channel"
import SearchGroupResult from "./group"
import SearchUserResult from "./user"

const SearchResultView = () => {
  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue="user" className="w-full flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="user" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="group" className="flex-1">
            Groups
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex-1">
            Channels
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
