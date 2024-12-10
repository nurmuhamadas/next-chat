import Image from "next/image"

import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface InputFilePreviewProps {
  file: File
  disabled?: boolean
  onRemove(): void
}

const InputFilePreview = ({
  file,
  disabled = false,
  onRemove,
}: InputFilePreviewProps) => {
  let url = "/images/folder.png"

  if (file.type.startsWith("image/")) {
    url = URL.createObjectURL(file)
  } else if (file.type.startsWith("audio/")) {
    url = "/images/audio.png"
  } else if (file.type.startsWith("video/")) {
    url = "/images/video.png"
  } else if (file.type === "application/pdf") {
    url = "/images/pdf.png"
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    url = "/images/doc.png"
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    url = "/images/xls.png"
  }

  return (
    <div className="relative flex h-max w-[100px] flex-col overflow-hidden rounded-md bg-grey-4 p-1.5">
      <Image
        src={url}
        alt={file.name}
        width={75}
        height={75}
        className="size-full"
      />
      <p className="line-clamp-1 caption">{file.name}</p>
      <Button
        variant="icon"
        size="icon-sm"
        className="absolute right-0 top-0 size-6  bg-foreground/50 hover:bg-foreground"
        disabled={disabled}
        onClick={onRemove}
      >
        <XIcon className="!size-3.5 text-surface" />
      </Button>
    </div>
  )
}

export default InputFilePreview
