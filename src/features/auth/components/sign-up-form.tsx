"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import useSignUp from "../hooks/use-sign-up"
import { signUpSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const SignUpForm = () => {
  const { mutate, isPending } = useSignUp()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate({ json: values })
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
        <Button type="submit" size="xl" className="w-full" disabled={isPending}>
          {isPending && <LoaderIcon className="size-6 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
