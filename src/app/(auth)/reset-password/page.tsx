import Link from "next/link"

import { Button } from "@/components/ui/button"
import ResetPasswordForm from "@/features/auth/components/reset-password-form"

const ResetPasswordPage = () => {
  return (
    <div className="w-full gap-y-9 flex-col-center">
      <h2 className="text-center font-bold h2 md:text-[36px]">
        Enter New Password
      </h2>
      <ResetPasswordForm />
      <p className="text-center body-2">
        Back to
        <Button variant="link" className="ml-2 px-0" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </p>
    </div>
  )
}

export default ResetPasswordPage
