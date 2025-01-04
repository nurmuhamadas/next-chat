"use client"

import { useState } from "react"

import { redirect, useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import ErrorAlert from "@/components/error-alert"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { useScopedI18n } from "@/lib/locale/client"

import useResetPassword from "../hooks/use-reset-password"
import { passwordResetSchema } from "../schema"

import AuthFormInput from "./auth-form-input"

const ResetPasswordForm = () => {
  const params = useSearchParams()
  const token = params.get("token")
  const email = params.get("email")

  const t = useScopedI18n("auth")

  const [errorMessage, setErrorMessage] = useState("")

  const { mutate: resetPassword, isPending } = useResetPassword()

  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof passwordResetSchema>) => {
    if (email && token) {
      resetPassword(
        { json: { ...values, email, token } },
        {
          onError(error) {
            setErrorMessage(error.message)
          },
        },
      )
    }
  }

  if (!token || !email) {
    return redirect("/sign-up")
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
          {t("reset_password.submit")}
        </Button>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
