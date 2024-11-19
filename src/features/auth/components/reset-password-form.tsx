"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import { resetPasswordSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <AuthFormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthFormInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
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

export default ResetPasswordForm
