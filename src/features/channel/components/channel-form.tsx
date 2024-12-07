"use client"

import { ChangeEventHandler, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon, LoaderIcon } from "lucide-react"
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

import { CHANNEL_TYPE_OPT } from "../constants"
import { channelSchema } from "../schema"

interface ChannelFormProps {
  isLoading?: boolean
  initialImageUrl?: string
  initialValues?: z.infer<typeof channelSchema>
  onSubmit(values: z.infer<typeof channelSchema>): void
}

const ChannelForm = ({
  isLoading = false,
  initialValues,
  initialImageUrl = "",
  onSubmit,
}: ChannelFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState(initialImageUrl)

  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: initialValues?.type ?? "PUBLIC",
    },
  })

  const submitForm = (values: z.infer<typeof channelSchema>) => {
    if (!values.image) delete values.image

    onSubmit(values)
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
                <Input placeholder="Enter your channel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your channel"
                  maxLength={2048}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) =>
                  form.setValue("type", value as ChannelType)
                }
              >
                <FormControl>
                  <SelectTrigger className="">
                    <SelectValue
                      className="placeholder:text-grey-2"
                      placeholder="Choose your channel type"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {CHANNEL_TYPE_OPT.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="flex items-center gap-x-2"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <LoaderIcon className="size-6 animate-spin" />}
            {initialValues ? "Update Channel" : "Create Channel"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChannelForm
