"use client"

import { useRef } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon } from "lucide-react"
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
import { profileSchema } from "@/features/user/schema"

import { GENDER_OPT } from "../constants"
import { Gender } from "../type"

interface ProfileFormProps {
  buttonLabel?: string
  onSubmit(values: z.infer<typeof profileSchema>): void
}

const ProfileForm = ({
  buttonLabel = "Submit",
  onSubmit,
}: ProfileFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      bio: "",
    },
  })

  const submitForm = (values: z.infer<typeof profileSchema>) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="w-full space-y-5"
      >
        <div className="flex justify-center">
          <input type="file" hidden ref={inputRef} className="hidden" />

          <Avatar
            className="relative size-[100px] cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <AvatarImage src="" />
            <AvatarFallback className="h1">CN</AvatarFallback>
            <div className="absolute size-full bg-grey-3/50 flex-center">
              <CameraIcon className="size-10 text-white" />
            </div>
          </Avatar>
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
              <FormControl>
                <Input placeholder="john_doe" {...field} />
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
        <Button type="submit" size="xl" className="w-full">
          {buttonLabel}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
