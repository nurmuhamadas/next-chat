"use client"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import useSignIn from "../hooks/use-sign-in"
import { signInSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const SignInForm = () => {
  const { mutate, isPending } = useSignIn()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
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
        <div className="">
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
          <Button variant="link" className="ml-2 px-0" asChild>
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" size="xl" className="w-full" disabled={isPending}>
          {isPending && <LoaderIcon className="size-6 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
