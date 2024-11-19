import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OTPForm from "@/features/auth/components/otp-form"

const EnterOTPPage = () => {
  return (
    <Card className="w-full gap-y-9 rounded-3xl px-9 pb-[60px] pt-10 flex-col-center">
      <h2 className="text-center text-h2 font-bold md:text-[36px]">
        Enter OTP
      </h2>
      <OTPForm />
      <p className="text-center text-body-2">
        Didn’t get a code?
        <Button variant="link" className="ml-2 px-0">
          Resend
        </Button>
      </p>
    </Card>
  )
}

export default EnterOTPPage
