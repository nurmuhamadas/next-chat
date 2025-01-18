import { useEffect, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { BASE_API_URL } from "@/lib/config"

import { useRoomId } from "./use-room-id"
import { useRoomType } from "./use-room-type"

export default function useWebSocket() {
  const queryClient = useQueryClient()

  const id = useRoomId()
  const type = useRoomType()

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(`${BASE_API_URL}/ws`)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
    }

    ws.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["get-messages", id, type, 20],
      })
      queryClient.invalidateQueries({
        queryKey: ["rooms", 20],
      })
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    }

    ws.onerror = (event) => {
      console.error("WebSocket error:", event)
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
      console.error("WebSocket is not open")
    }
  }

  return { sendMessage, isConnected }
}
