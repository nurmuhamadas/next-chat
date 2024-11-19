import { HTMLInputTypeAttribute, useState } from "react"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface AuthFormInputProps extends ControllerRenderProps {
  label: string
  placeholder: string
  type?: HTMLInputTypeAttribute
}

const AuthFormInput = ({
  label,
  placeholder,
  type,
  ...field
}: AuthFormInputProps) => {
  const [isViewPassword, setIsViewPassword] = useState(type !== "password")

  const inputType = type === "password" && isViewPassword ? "text" : type

  return (
    <FormItem className="min-h-[78px] space-y-1.5 rounded-xl bg-surface p-4">
      <FormLabel className="text-subtitle-2">{label}</FormLabel>
      <div className="flex">
        <FormControl>
          <Input
            className="h-auto border-none p-0 text-body-2 focus:outline-none"
            placeholder={placeholder}
            type={inputType}
            {...field}
          />
        </FormControl>
        {type === "password" && (
          <Button
            onClick={() => setIsViewPassword(!isViewPassword)}
            variant="ghost"
            size="icon-sm"
            type="button"
            className="text-grey-3"
          >
            {isViewPassword ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        )}
      </div>
      <FormMessage className="mt-1" />
    </FormItem>
  )
}

export default AuthFormInput
