import { useEffect, useState } from "react"

import { CheckCircleIcon, LoaderIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ERROR } from "@/constants/error"
import { useI18n } from "@/lib/locale/client"
import { debounce } from "@/lib/utils"

import useUsernameAvaiability from "../hooks/use-username-availability"

interface UsernameFormInputProps {
  initialValue?: string
  form: UseFormReturn<{
    email: string
    password: string
    username: string
    confirmPassword: string
  }>
}

const UsernameFormInput = ({ form, initialValue }: UsernameFormInputProps) => {
  const t = useI18n()

  const [username, setUsername] = useState(initialValue ?? "")

  const { data: isUsernameAvailable, isFetching: isCheckingUsername } =
    useUsernameAvaiability({ username })

  const debouncedCheckUsername = debounce((value: string) => {
    setUsername(value)
  }, 500)

  useEffect(() => {
    if (!isCheckingUsername && isUsernameAvailable === false) {
      form.setError("username", { message: t(ERROR.USERNAME_ALREADY_EXIST) })
    } else {
      form.clearErrors("username")
    }
  }, [form, isCheckingUsername, isUsernameAvailable])

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem className="min-h-[78px] space-y-1.5 rounded-xl bg-surface p-4">
          <FormLabel>Username</FormLabel>
          <div className="relative flex">
            <FormControl>
              <Input
                className="h-auto border-none p-0 body-2 focus-visible:ring-0"
                placeholder="john_doe"
                {...field}
                onChange={(e) => {
                  form.setValue("username", e.target.value)
                  debouncedCheckUsername(e.target.value)
                }}
              />
            </FormControl>

            {username && (
              <div className="absolute right-3 top-0">
                {isCheckingUsername ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : isUsernameAvailable === true ? (
                  <CheckCircleIcon className="size-4 text-success" />
                ) : null}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default UsernameFormInput
