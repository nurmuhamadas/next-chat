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
import { useScopedI18n } from "@/lib/locale/client"

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
  const t = useScopedI18n("auth.forgot_password")
  const tAuth = useScopedI18n("auth")

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
        <h2 className="!font-semibold h3">{t("success.title")}</h2>
        <p className="max-w-72 text-center body-2">{t("success.desc")}</p>
        <p className="mt-2 text-center body-2">
          {t("success.question")}
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
            {isPending && <LoaderIcon className="size-4 animate-spin" />}{" "}
            {t("success.action")} {count > 0 && t("success.count", { count })}
          </Button>
        </p>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <AuthFormInput
              label={tAuth("form.email")}
              placeholder={tAuth("form.email.placeholder")}
              {...field}
            />
          )}
        />
        <Button type="submit" size="xl" className="w-full">
          {t("submit")}
        </Button>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
