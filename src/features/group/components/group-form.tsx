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

import { GROUP_TYPE_OPT } from "../constants"
import useGroupNameAvailability from "../hooks/api/use-group-name-availability"
import { groupSchema } from "../schema"

import SelectUsers from "./select-users"

interface GroupFormProps {
  isLoading?: boolean
  initialImageUrl?: string
  initialValues?: Partial<z.infer<typeof groupSchema>>
  errorMessage?: string
  onSubmit(values: z.infer<typeof groupSchema>): void
}

const GroupForm = ({
  isLoading = false,
  initialValues,
  initialImageUrl = "",
  errorMessage,
  onSubmit,
}: GroupFormProps) => {
  const t = useScopedI18n("group")

  const inputRef = useRef<HTMLInputElement>(null)

  const [groupName, setGroupName] = useState(initialValues?.name ?? "")
  const [imagePreview, setImagePreview] = useState(initialImageUrl)

  const { data: isGroupNameAvailable, isFetching: isCheckingGroupName } =
    useGroupNameAvailability({
      groupName: groupName !== initialValues?.name ? groupName : undefined,
    })

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: initialValues?.type ?? "PUBLIC",
      memberIds: undefined,
    },
  })

  const submitForm = (values: z.infer<typeof groupSchema>) => {
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

  const debouncedCheckGroupName = debounce((value: string) => {
    setGroupName(value)
  }, 500)

  useEffect(() => {
    if (!isCheckingGroupName && isGroupNameAvailable === false) {
      form.setError("name", { message: ERROR.GROUP_NAME_DUPLICATED })
    } else {
      form.clearErrors("name")
    }
  }, [form, isCheckingGroupName, isGroupNameAvailable])

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
                      debouncedCheckGroupName(e.target.value)
                    }}
                  />
                </FormControl>

                {groupName && (
                  <div className="absolute right-3 top-[18px]">
                    {isCheckingGroupName ? (
                      <LoaderIcon className="size-4 animate-spin" />
                    ) : isGroupNameAvailable === true ? (
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
                  form.setValue("type", value as GroupType)
                }
              >
                <FormControl>
                  <SelectTrigger className="">
                    <SelectValue className="placeholder:text-grey-2" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {GROUP_TYPE_OPT.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="flex items-center gap-x-2"
                    >
                      {t(label as any, { count: 0 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!initialValues && (
          <FormField
            control={form.control}
            name="memberIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.members")}</FormLabel>
                <SelectUsers
                  selectedIds={field.value ? field.value.split(",") : []}
                  onValuesChange={(ids) =>
                    form.setValue("memberIds", ids.join(","))
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="pt-4">
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <LoaderIcon className="size-6 animate-spin" />}
            {initialValues ? t("edit.submit") : t("new.submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default GroupForm
