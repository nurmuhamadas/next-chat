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

import { GROUP_TYPE_OPT } from "../constants"
import { groupSchema } from "../schema"

const GroupForm = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "PUBLIC",
    },
  })

  const submitForm = (values: z.infer<typeof groupSchema>) => {
    console.log(values)
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
            <AvatarFallback className="h1"></AvatarFallback>
            <div className="absolute size-full bg-grey-3/50 flex-center">
              <CameraIcon className="size-10 text-white" />
            </div>
          </Avatar>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your group name" {...field} />
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
                  placeholder="Describe your group"
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
                  form.setValue("type", value as GroupType)
                }
              >
                <FormControl>
                  <SelectTrigger className="">
                    <SelectValue
                      className="placeholder:text-grey-2"
                      placeholder="Choose your group type"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {GROUP_TYPE_OPT.map(({ label, value }) => (
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
          <Button type="submit" size="xl" className=" w-full">
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default GroupForm
