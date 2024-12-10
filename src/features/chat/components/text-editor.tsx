import { ChangeEventHandler, useRef } from "react"

interface TextEditorProps {
  value?: string
  placeholder?: string
  onValueChange(value: string): void
}

const TextEditor = ({
  value = "",
  placeholder = "Input message here...",
  onValueChange,
}: TextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 8 * 24)}px`
      onValueChange(e.target.value)
    }
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className="max-h-40 w-full resize-none overflow-y-auto bg-transparent body-2 focus:outline-none"
      rows={1}
    />
  )
}

export default TextEditor
