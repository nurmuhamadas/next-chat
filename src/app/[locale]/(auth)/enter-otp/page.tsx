import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OTPForm from "@/features/auth/components/otp-form"

interface EnterOTPPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const EnterOTPPage = async ({ searchParams }: EnterOTPPageProps) => {
  const otpId = (await searchParams).otpId
  const email = (await searchParams).email
  if (!otpId && !email) {
    return redirect("/sign-up")
  }

  return (
    <Card className="w-full gap-y-9 rounded-3xl px-9 pb-[60px] pt-10 flex-col-center">
      <h2 className="text-center font-bold h2 md:text-[36px]">Enter OTP</h2>
      <OTPForm otpId={otpId as string} email={email as string} />
      <p className="text-center body-2">
        Didn’t get a code?
        <Button variant="link" className="ml-2 px-0">
          Resend
        </Button>
      </p>
    </Card>
  )
}

export default EnterOTPPage
