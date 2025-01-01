import { useRef, useState } from "react"

import { MicIcon, PauseIcon, PlayIcon, StopCircleIcon } from "lucide-react"

import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"

interface AudioRecorderProps {
  onStop(audioBlob: Blob): void
}
const AudioRecorder = ({ onStop }: AudioRecorderProps) => {
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle")
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<number | null>(null)

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${minutes}:${remainingSeconds}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      audioChunksRef.current = [] // Reset audio chunks
      setDuration(0) // Reset durasi

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        })
        onStop(audioBlob)
        clearInterval(intervalRef.current as number)
      }

      mediaRecorder.start()
      setRecordingState("recording")

      intervalRef.current = window.setInterval(() => {
        setDuration((prev) => {
          if (prev >= 300) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecordingState("idle")
      clearInterval(intervalRef.current as number)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause()
      setRecordingState("paused")
      clearInterval(intervalRef.current as number)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume()
      setRecordingState("recording")

      intervalRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {recordingState === "idle" && (
        <SimpleTooltip content="Start recording">
          <Button
            className="size-11 bg-surface hover:bg-primary"
            variant="secondary"
            onClick={startRecording}
          >
            <MicIcon />
          </Button>
        </SimpleTooltip>
      )}
      {recordingState === "recording" && (
        <>
          <SimpleTooltip content="Pause recording">
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
              onClick={pauseRecording}
            >
              <PauseIcon />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Stop recording">
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
              onClick={stopRecording}
            >
              <div className="size-3 max-h-5 bg-secondary-foreground" />
            </Button>
          </SimpleTooltip>
        </>
      )}
      {recordingState === "paused" && (
        <>
          <SimpleTooltip content="Resume recording">
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
              onClick={resumeRecording}
            >
              <PlayIcon />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Stop recording">
            <Button
              className="size-11 bg-surface hover:bg-primary"
              variant="secondary"
              onClick={stopRecording}
            >
              <StopCircleIcon />
            </Button>
          </SimpleTooltip>
        </>
      )}
      {recordingState !== "idle" && (
        <div className="flex items-center gap-x-1">
          <div className="size-2 animate-pulse rounded-sm bg-error" />
          <p className="caption">{formatDuration(duration)}</p>
        </div>
      )}
    </div>
  )
}

export default AudioRecorder
