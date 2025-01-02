"use client"

import { useState } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form"
import { useScopedI18n } from "@/lib/locale/client"

const ForgotPasswordPage = () => {
  const [showEmailSent, setShowEmailSent] = useState(false)

  const t = useScopedI18n("auth.forgot_password")

  return (
    <div className="w-full gap-y-9 flex-col-center">
      {!showEmailSent && (
        <h2 className="text-center font-bold h2 md:text-[36px]">
          {t("title")}
        </h2>
      )}
      <ForgotPasswordForm
        showEmailSent={showEmailSent}
        onSuccess={() => setShowEmailSent(true)}
      />

      {!showEmailSent && (
        <p className="text-center body-2">
          {t("back")}
          <Button variant="link" className="ml-2 px-0" asChild>
            <Link href="/sign-in">{t("link")}</Link>
          </Button>
        </p>
      )}
    </div>
  )
}

export default ForgotPasswordPage
