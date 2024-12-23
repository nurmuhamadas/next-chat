"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import ProfileForm from "@/features/user/components/profile-form"
import useCreateProfile from "@/features/user/hooks/api/use-create-profile"

const CompleteProfileForm = () => {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState("")

  const { mutate: createProfile, isPending } = useCreateProfile()

  return (
    <Card className="w-full gap-y-10 rounded-3xl px-9 pb-[60px] pt-10 flex-col-center">
      <h2 className="text-center font-bold h2">Complete Your Profile</h2>
      <ProfileForm
        isLoading={isPending}
        errorMessage={errorMessage}
        onSubmit={(values) =>
          createProfile(
            { form: values },
            {
              onSuccess() {
                router.push("/")
              },
              onError(error) {
                setErrorMessage(error.message)
              },
            },
          )
        }
      />
    </Card>
  )
}

export default CompleteProfileForm
