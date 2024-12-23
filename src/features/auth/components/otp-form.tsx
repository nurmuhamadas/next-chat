"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp"

import { otpSchema } from "../schema"

interface OTPFormProps {
  otpId: string
  email: string
}
const OTPForm = ({ email }: OTPFormProps) => {
  // const { mutate, isPending } = useVerifyOTP()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    console.log(values)
    // mutate({
    //   json: values,
    //   param: { userId: otpId },
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <p className="text-center body-1">
          We&apos;ve sent a code to{" "}
          <span className="font-semibold text-primary">{email}</span>
        </p>

        <FormField
          control={form.control}
          name="code"
          render={() => (
            <InputOTP
              maxLength={6}
              onChange={(value) => form.setValue("code", value)}
            >
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTP>
          )}
        />
        <Button type="submit" size="xl" className="w-full">
          {/* {isPending && <LoaderIcon className="size-6 animate-spin" />} */}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default OTPForm
