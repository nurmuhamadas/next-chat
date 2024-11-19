import Link from "next/link"

import { Button } from "@/components/ui/button"
import AuthForm from "@/features/auth/components/sign-in-form"

const SignInPage = () => {
  return (
    <div className="w-full gap-y-9 flex-col-center">
      <h2 className="text-[36px] font-bold">Sign In</h2>
      <AuthForm />
      <p className="text-center text-body-2">
        Don&apos;t have an account?
        <Button variant="link" className="ml-2 px-0" asChild>
          <Link href="/sign-in">Create Account</Link>
        </Button>
      </p>
    </div>
  )
}

export default SignInPage
