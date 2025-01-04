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

import useResendVerificationEmail from "../hooks/use-resend-verification-email"
import useSignUp from "../hooks/use-sign-up"
import { signUpSchema } from "../schema"

import AuthFormInput from "./auth-form-input"
import UsernameFormInput from "./username-form-input"

interface SignUpFormProps {
  showVerification: boolean
  onSuccess(): void
}
const SignUpForm = ({ showVerification, onSuccess }: SignUpFormProps) => {
  const t = useScopedI18n("auth")

  const [errorMessage, setErrorMessage] = useState("")
  const [count, setCount] = useState(60)

  const { mutate: signUp, isPending } = useSignUp()
  const { mutate: resendEmail, isPending: isResending } =
    useResendVerificationEmail()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    signUp(
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

  const onResend = () => {
    resendEmail(
      { json: { email: form.getValues("email") } },
      {
        onSuccess() {
          startTimer()
        },
      },
    )
  }

  if (showVerification) {
    return (
      <Card className="w-full gap-y-4 pb-4 flex-col-center">
        <Image
          src="/images/message-sent.svg"
          alt="email-sent"
          width={244}
          height={192}
        />
        <h2 className="!font-semibold h3">Verification email is on the way</h2>
        <p className="max-w-72 text-center body-2">
          For security reason, we&apos;ve sent you an email that contain link to
          verify it is yours.
        </p>
        <p className="mt-2 text-center body-2">
          Don&apos;t receive an email?
          <Button
            variant="link"
            className="ml-2 px-0"
            disabled={count > 0}
            onClick={onResend}
          >
            {isResending && <LoaderIcon className="size-4 animate-spin" />}{" "}
            Resend {count > 0 && `(${count}s)`}
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

        <UsernameFormInput form={form} initialValue="" />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <AuthFormInput
              label={t("form.email")}
              placeholder={t("form.email.placeholder")}
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <AuthFormInput
              label={t("form.password")}
              type="password"
              placeholder={t("form.password.placeholder")}
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthFormInput
              label={t("form.confirm_password")}
              type="password"
              placeholder={t("form.confirm_password.placeholder")}
              {...field}
            />
          )}
        />
        <Button type="submit" size="xl" className="w-full" disabled={isPending}>
          {isPending && <LoaderIcon className="size-6 animate-spin" />}
          {t("sign_up.submit")}
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
