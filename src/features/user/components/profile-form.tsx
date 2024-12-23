"use client"

import { ChangeEventHandler, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon, LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import ErrorAlert from "@/components/error-alert"
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
import useLogout from "@/features/auth/hooks/use-logout"
import { profileSchema } from "@/features/user/schema"

import { GENDER_OPT } from "../constants"

interface ProfileFormProps {
  buttonLabel?: string
  isLoading?: boolean
  initialImageUrl?: string
  initialValues?: z.infer<typeof profileSchema>
  errorMessage?: string
  showLogout?: boolean
  onSubmit(values: z.infer<typeof profileSchema>): void
}

const ProfileForm = ({
  buttonLabel = "Submit",
  isLoading = false,
  initialValues,
  initialImageUrl = "",
  errorMessage,
  showLogout,
  onSubmit,
}: ProfileFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState(initialImageUrl)

  const { mutate: logout } = useLogout()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      gender: initialValues?.gender ?? "MALE",
      bio: initialValues?.bio ?? "",
      image: initialValues?.image,
    },
  })

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="w-full space-y-5"
      >
        <ErrorAlert message={errorMessage} />

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
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
        <div className="flex-center">
          {showLogout && (
            <Button type="button" variant="link" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
