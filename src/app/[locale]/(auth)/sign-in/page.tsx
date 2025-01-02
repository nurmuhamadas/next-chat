"use client"

import { useState } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import SignInForm from "@/features/auth/components/sign-in-form"

const SignInPage = () => {
  const [showVerification, setShowVerification] = useState(false)

  return (
    <div className="w-full gap-y-9 flex-col-center">
      {!showVerification && (
        <h2 className="text-center font-bold h2 md:text-[36px]">Sign In</h2>
      )}
      <SignInForm
        showVerification={showVerification}
        onSuccess={() => setShowVerification(true)}
      />
      {!showVerification && (
        <p className="text-center body-2">
          Don&apos;t have an account?
          <Button variant="link" className="ml-2 px-0" asChild>
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </p>
      )}
    </div>
  )
}

export default SignInPage
