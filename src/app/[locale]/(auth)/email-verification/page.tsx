"use client"

import { useEffect, useState } from "react"

import { redirect, useSearchParams } from "next/navigation"

import { CheckCircle2Icon, Loader2, TriangleAlertIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { useScopedI18n } from "@/lib/locale/client"

const EmailVerificationPage = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const t = useScopedI18n("auth.email_verification")

  const [error] = useState("")
  const [isSuccess] = useState(false)

  const { mutate: verifyEmail, isPending } = {
    isPending: false,
    mutate: () => {},
  }

  useEffect(() => {
    if (token && email) {
      verifyEmail()
    }
  }, [email, token, verifyEmail])

  if (!token || !email) {
    return redirect("/sign-up")
  }

  return (
    <Card className="min-h-72 w-full justify-center gap-y-4 py-12 flex-col-center">
      {(!token || !email || isPending) && (
        <>
          <Loader2 className="size-12 animate-spin text-primary" />
          <h2 className="!font-semibold h3">{t("loading")}</h2>
        </>
      )}
      {error && (
        <>
          <TriangleAlertIcon className="size-12 text-error" />
          <p className="text-error">{error}</p>
        </>
      )}
      {isSuccess && (
        <>
          <CheckCircle2Icon className="size-12 text-success" />
          <p className="">{t("success")}</p>
        </>
      )}
    </Card>
  )
}

export default EmailVerificationPage
