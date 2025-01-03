"use client"

import { useState } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import SignUpForm from "@/features/auth/components/sign-up-form"
import { useScopedI18n } from "@/lib/locale/client"

const SignUpPage = () => {
  const [showVerification] = useState(false)

  const t = useScopedI18n("auth.sign_up")

  return (
    <div className="w-full gap-y-9 flex-col-center">
      {!showVerification && (
        <h2 className="text-center font-bold h2 md:text-[36px]">
          {t("title")}
        </h2>
      )}
      <SignUpForm
        showVerification={showVerification}
        // onSuccess={() => setShowVerification(true)}
        onSuccess={() => {}}
      />
      {!showVerification && (
        <p className="text-center body-2">
          {t("question")}
          <Button variant="link" className="ml-2 px-0" asChild>
            <Link href="/sign-in">{t("link")}</Link>
          </Button>
        </p>
      )}
    </div>
  )
}

export default SignUpPage
