/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ChangeEventHandler, useEffect, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon, CheckCircleIcon, LoaderIcon } from "lucide-react"
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
import { ERROR } from "@/constants/error"
import { useScopedI18n } from "@/lib/locale/client"
import { debounce } from "@/lib/utils"

import { CHANNEL_TYPE_OPT } from "../constants"
import useChannelNameAvailability from "../hooks/api/use-channel-name-availability"
import { channelSchema } from "../schema"

interface ChannelFormProps {
  isLoading?: boolean
  initialImageUrl?: string
  initialValues?: Partial<z.infer<typeof channelSchema>>
  errorMessage?: string
  onSubmit(values: z.infer<typeof channelSchema>): void
}

const ChannelForm = ({
  isLoading = false,
  initialValues,
  initialImageUrl = "",
  errorMessage,
  onSubmit,
}: ChannelFormProps) => {
  const t = useScopedI18n("channel")

  const inputRef = useRef<HTMLInputElement>(null)

  const [channelName, setChannelName] = useState(initialValues?.name ?? "")
  const [imagePreview, setImagePreview] = useState(initialImageUrl)

  const { data: isChannelNameAvailable, isFetching: isCheckingChannelName } =
    useChannelNameAvailability({
      channelName:
        channelName !== initialValues?.name ? channelName : undefined,
    })

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

  const debouncedCheckChannelName = debounce((value: string) => {
    setChannelName(value.trim())
  }, 500)

  useEffect(() => {
    if (!isCheckingChannelName && isChannelNameAvailable === false) {
      form.setError("name", { message: ERROR.CHANNEL_NAME_DUPLICATED })
    } else {
      form.clearErrors("name")
    }
  }, [form, isCheckingChannelName, isChannelNameAvailable])

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
              <FormLabel>{t("form.name")}</FormLabel>
              <div className="relative flex">
                <FormControl>
                  <Input
                    placeholder={t("form.name.placeholder")}
                    {...field}
                    onChange={(e) => {
                      form.setValue("name", e.target.value)
                      debouncedCheckChannelName(e.target.value)
                    }}
                  />
                </FormControl>

                {channelName && (
                  <div className="absolute right-3 top-[18px]">
                    {isCheckingChannelName ? (
                      <LoaderIcon className="size-4 animate-spin" />
                    ) : isChannelNameAvailable === true ? (
                      <CheckCircleIcon className="size-4 text-success" />
                    ) : null}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("form.description.placeholder")}
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
              <FormLabel>{t("form.type")}</FormLabel>
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
                      {t(label as any)}
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
