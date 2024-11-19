import Link from "next/link"

import { Button } from "@/components/ui/button"
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form"

const ForgotPasswordPage = () => {
  return (
    <div className="w-full gap-y-9 flex-col-center">
      <h2 className="text-center font-bold h2 md:text-[36px]">
        Forgot Password
      </h2>
      <ForgotPasswordForm />
      <p className="text-center body-2">
        Back to
        <Button variant="link" className="ml-2 px-0" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </p>
    </div>
  )
}

export default ForgotPasswordPage
