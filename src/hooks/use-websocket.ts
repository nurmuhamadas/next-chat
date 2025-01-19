import { useEffect, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { BASE_API_URL } from "@/lib/config"

import { useRoomId } from "./use-room-id"
import { useRoomType } from "./use-room-type"

export default function useWebsocket() {
  const queryClient = useQueryClient()

  const id = useRoomId()
  const type = useRoomType()

  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`${BASE_API_URL}/ws/messages`)

    ws.onopen = () => {
      console.log("MessageSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketMessage

      if (data.type === "ONLINE") {
        setOnlineUserIds(data.data)
      } else if (data.type === "MESSAGE") {
        queryClient.invalidateQueries({
          queryKey: ["get-messages", id, type, 20],
        })
        queryClient.invalidateQueries({
          queryKey: ["rooms", 20],
        })
      }
    }

    ws.onclose = () => {
      console.log("MessageSocket disconnected")
    }

    ws.onerror = (event) => {
      console.error("MessageSocket error:", event)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message)
    } else {
      console.error("MessageSocket is not open")
    }
  }

  return { sendMessage, onlineUserIds }
}
