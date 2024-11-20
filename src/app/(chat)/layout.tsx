import { PropsWithChildren } from "react"

import Sidebar from "@/components/sidebar"

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex">
      <Sidebar />

      {children}
    </div>
  )
}

export default ChatLayout
