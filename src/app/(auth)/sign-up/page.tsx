import Link from "next/link"

import { Button } from "@/components/ui/button"
import SignUpForm from "@/features/auth/components/sign-up-form"

const SignUpPage = () => {
  return (
    <div className="w-full gap-y-9 flex-col-center">
      <h2 className="text-center font-bold h2 md:text-[36px]">
        Create Account
      </h2>
      <SignUpForm />
      <p className="text-center body-2">
        Already have an account?
        <Button variant="link" className="ml-2 px-0" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </p>
    </div>
  )
}

export default SignUpPage
