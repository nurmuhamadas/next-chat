"use client"

import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageItem from "./message-item"

const MessageList = () => {
  const chatRef = useRef<HTMLDivElement>(null)

  const { selectedMessageIds } = useSelectedMessageIds()

  useEffect(() => {
    const chatContainer = chatRef.current
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [])

  return (
    <ScrollArea ref={chatRef} className="chat-list-scroll-area size-full">
      <div className="mx-auto flex w-full max-w-[700px] flex-col-reverse gap-y-2 px-4 pt-4">
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "😀",
          }}
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded
          isSender
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "😀",
          }}
          time="12:17"
          isForwarded
          type="group"
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded
          isSender
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded
          type="group"
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded={false}
          isSender={false}
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded
          isSender
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          time="12:17"
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          isForwarded={false}
          isSender
          attachments={[]}
          parentMessage={{
            id: "1",
            name: "Parent",
            message: "Lorem ipsum dolor sit amet",
          }}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "Lorem ipsum dolor sit amet ",
          }}
          time="12:17"
          isForwarded
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
        <MessageItem
          message={{
            id: "123",
            name: "User Name",
            message: "😀",
          }}
          time="12:17"
          isForwarded
          type="group"
          attachments={[]}
          isSelected={selectedMessageIds.includes("123")}
        />
      </div>
    </ScrollArea>
  )
}

export default MessageList
