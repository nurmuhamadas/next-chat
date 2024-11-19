"use client"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import { signInSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const SignIn = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
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
            <Link href="/sign-in">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" size="xl" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}

export default SignIn
