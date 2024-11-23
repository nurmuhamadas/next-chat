"use client"

import { useState } from "react"

import {
  ImageIcon,
  MicIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SmileIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import TextEditor from "./text-editor"

const ChatInput = () => {
  const [message, setMessage] = useState("")

  return (
    <div className="flex w-full justify-center p-4 pt-3">
      <div className="flex w-full max-w-[700px] items-center gap-x-2">
        <div className="flex flex-1 items-center rounded-xl bg-surface p-3">
          {/* Replied message will be here */}

          <div className="flex flex-1 items-end gap-x-2">
            <Button
              variant="icon"
              size="icon"
              className="size-5 p-0 hover:text-primary"
            >
              <SmileIcon />
            </Button>

            <TextEditor onValueChange={setMessage} />

            <div className="gap-x-2 flex-center-end">
              <Button
                variant="icon"
                size="icon"
                className="size-5 p-0 hover:text-primary"
              >
                <ImageIcon />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="size-5 p-0 hover:text-primary"
              >
                <PaperclipIcon />
              </Button>
            </div>
          </div>
        </div>

        <div className="">
          {message.length > 0 ? (
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
            >
              <SendHorizonalIcon />
            </Button>
          ) : (
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
            >
              <MicIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput
