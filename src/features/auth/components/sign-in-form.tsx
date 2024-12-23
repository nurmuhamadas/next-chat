"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"

import useResendVerificationEmail from "../hooks/use-resend-verification-email"
import useSignIn from "../hooks/use-sign-in"
import { signInSchema } from "../schema"

import AuthFormInput from "./auth-form-input"
import ErrorAlert from "./error-alert"

interface SignInFormProps {
  showVerification: boolean
  onSuccess(): void
}
const SignInForm = ({ showVerification, onSuccess }: SignInFormProps) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [count, setCount] = useState(60)
  const [verifyType, setVerifyType] = useState<"2fa" | "unverified">(
    "unverified",
  )

  const { mutate: signIn, isPending } = useSignIn()
  const { mutate: resendEmail, isPending: isResending } =
    useResendVerificationEmail()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
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

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    signIn(
      { json: values },
      {
        onSuccess({ data }) {
          if (data.status !== "success") {
            setVerifyType(data.status)
            onSuccess()
            startTimer()
          }
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

  const MESSAGES = {
    "2fa": {
      title: "Two Factor Authentication",
      body: "We've sent you an email that contain link to login. Please open the link to continue",
    },
    unverified: {
      title: "Verification email is on the way",
      body: "For security reason, we've sent you an email that contain link to verify it is you.",
    },
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
        <h2 className="!font-semibold h3">{MESSAGES[verifyType].title}</h2>
        <p className="max-w-72 text-center body-2">
          {MESSAGES[verifyType].body}
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
