"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import { forgotPassworsSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPassworsSchema>>({
    resolver: zodResolver(forgotPassworsSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof forgotPassworsSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <AuthFormInput
              label="Email"
              placeholder="john@example.com"
              {...field}
            />
          )}
        />
        <Button type="submit" size="xl" className="w-full">
          Send Reset Link
        </Button>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
