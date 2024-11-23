"use client"

import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import MessageItem from "./message-item"

const MessageList = () => {
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chatContainer = chatRef.current
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [])

  return (
    <ScrollArea ref={chatRef} className="chat-list-scroll-area size-full">
      <div className="mx-auto flex w-full max-w-[700px] flex-col-reverse gap-y-2 pt-4">
        <MessageItem
          name="Username"
          message="😀"
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded
          isSender
          attachments={[]}
        />
        <MessageItem
          name="Username"
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded
          attachments={[]}
        />
        <MessageItem
          message="😀"
          time="12:17"
          isForwarded
          name="Usernme"
          type="group"
          attachments={[]}
        />
        <MessageItem
          name="Username"
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded
          isSender
          attachments={[]}
        />
        <MessageItem
          name="Username"
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded
          attachments={[]}
        />
        <MessageItem
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded
          name="Usernme"
          type="group"
          attachments={[]}
        />
        <MessageItem
          name="Username"
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded
          isSender
          attachments={[]}
        />
        <MessageItem
          name="Username"
          time="12:17"
          message="Lorem ipsum dolor sit amet "
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
        />
        <MessageItem
          message="Lorem ipsum dolor sit amet "
          time="12:17"
          isForwarded
          attachments={[]}
        />
        <MessageItem
          message="😀"
          time="12:17"
          isForwarded
          name="Usernme"
          type="group"
          attachments={[]}
        />
      </div>
    </ScrollArea>
  )
}

export default MessageList
