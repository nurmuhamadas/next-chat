"use client"

import { ChangeEventHandler, useEffect, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon, CheckCircleIcon, LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ERROR } from "@/constants/error"
import { profileSchema } from "@/features/user/schema"
import { debounce } from "@/lib/utils"

import { GENDER_OPT } from "../constants"
import { useValidateUsername } from "../hooks/api/use-validate-username"

interface ProfileFormProps {
  buttonLabel?: string
  isLoading?: boolean
  initialImageUrl?: string
  initialValues?: z.infer<typeof profileSchema>
  onSubmit(values: z.infer<typeof profileSchema>): void
}

const ProfileForm = ({
  buttonLabel = "Submit",
  isLoading = false,
  initialValues,
  initialImageUrl = "",
  onSubmit,
}: ProfileFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState(initialImageUrl)
  const [username, setUsername] = useState(initialValues?.username ?? "")

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      username: initialValues?.username ?? "",
      gender: initialValues?.gender ?? "MALE",
      bio: initialValues?.bio ?? "",
      image: initialValues?.image,
    },
  })

  const { data: isUsernameAvailable, isFetching: isCheckingUsername } =
    useValidateUsername({
      username,
    })

  const debouncedCheckUsername = debounce((value: string) => {
    if (value.trim() !== "") {
      setUsername(value)
    }
  }, 500)

  const submitForm = (values: z.infer<typeof profileSchema>) => {
    if (!values.image) delete values.image
    onSubmit({ ...values })
  }

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = e.target.files?.[0]
    if (image) {
      setImagePreview(URL.createObjectURL(image))
      form.setValue("image", image)
    }
  }

  useEffect(() => {
    if (!isCheckingUsername && isUsernameAvailable === false) {
      form.setError("username", { message: ERROR.USERNAME_ALREADY_EXIST })
    } else {
      form.clearErrors("username")
    }
  }, [form, isCheckingUsername, isUsernameAvailable])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="w-full space-y-5"
      >
        <div className="flex justify-center">
          <input
            type="file"
            hidden
            ref={inputRef}
            accept="image/png,image/jpg,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <div className="gap-y-1 flex-col-center">
                <Avatar
                  className="relative size-[100px] cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                >
                  <AvatarImage src={imagePreview} />
                  <AvatarFallback className="h1"></AvatarFallback>
                  <div className="absolute size-full bg-grey-3/50 flex-center">
                    <CameraIcon className="size-10 text-white" />
                  </div>
                </Avatar>
                <FormMessage />
              </div>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <div className="relative flex">
                <FormControl>
                  <Input
                    placeholder="john_doe"
                    {...field}
                    onChange={(e) => {
                      form.setValue("username", e.target.value)
                      debouncedCheckUsername(e.target.value)
                    }}
                  />
                </FormControl>

                {isCheckingUsername ? (
                  <div className="absolute right-3 top-[18px]">
                    <LoaderIcon className="size-4 animate-spin" />
                  </div>
                ) : isUsernameAvailable === true ? (
                  <div className="absolute right-3 top-[18px]">
                    <CheckCircleIcon className="size-4 text-success" />
                  </div>
                ) : null}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) =>
                  form.setValue("gender", value as Gender)
                }
              >
                <FormControl>
                  <SelectTrigger className="">
                    <SelectValue
                      className="placeholder:text-grey-2"
                      placeholder="Choose your gender"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {GENDER_OPT.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe yourself"
                  maxLength={2048}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderIcon className="size-6 animate-spin" />}
          {buttonLabel}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
