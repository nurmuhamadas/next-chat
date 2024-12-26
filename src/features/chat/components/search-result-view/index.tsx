import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SearchChannelResult from "./channel"
import SearchGroupResult from "./group"
import SearchUserResult from "./user"

const SearchResultView = () => {
  return (
    <div className="flex-1">
      <Tabs defaultValue="user" className="w-full">
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
        <TabsContent value="user">
          <SearchUserResult />
        </TabsContent>
        <TabsContent value="group">
          <SearchGroupResult />
        </TabsContent>
        <TabsContent value="channel">
          <SearchChannelResult />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SearchResultView
