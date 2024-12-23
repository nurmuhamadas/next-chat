"use client"

import { useState } from "react"

import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import ErrorAlert from "@/components/error-alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"

import useRequestPasswordReset from "../hooks/use-request-password-reset"
import { emailPasswordResetSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

interface ForgotPasswordFormProps {
  showEmailSent: boolean
  onSuccess(): void
}
const ForgotPasswordForm = ({
  showEmailSent,
  onSuccess,
}: ForgotPasswordFormProps) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [count, setCount] = useState(60)

  const { mutate: requestEmail, isPending } = useRequestPasswordReset()

  const form = useForm<z.infer<typeof emailPasswordResetSchema>>({
    resolver: zodResolver(emailPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setCount((v) => {
        if (v > 0) {
          return v - 1
        }

        clearInterval(intervalId)
        return 0
      })
    }, 1000)
  }

  const onSubmit = (values: z.infer<typeof emailPasswordResetSchema>) => {
    requestEmail(
      { json: values },
      {
        onSuccess() {
          onSuccess()
          startTimer()
        },
        onError(error) {
          setErrorMessage(error.message)
        },
      },
    )
  }

  if (showEmailSent) {
    return (
      <Card className="w-full gap-y-4 pb-4 flex-col-center">
        <Image
          src="/images/message-sent.svg"
          alt="email-sent"
          width={244}
          height={192}
        />
        <h2 className="!font-semibold h3">Password Reset Link Sent</h2>
        <p className="max-w-72 text-center body-2">
          We&apos;ve sent you an email that contain reset link. Open the link to
          reset your password
        </p>
        <p className="mt-2 text-center body-2">
          Don&apos;t receive an email?
          <Button
            variant="link"
            className="ml-2 px-0"
            disabled={count > 0}
            onClick={() =>
              onSubmit({
                email: form.getValues("email"),
              })
            }
          >
            {isPending && <LoaderIcon className="size-4 animate-spin" />} Resend{" "}
            {count > 0 && `(${count}s)`}
          </Button>
        </p>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <ErrorAlert message={errorMessage} />

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
