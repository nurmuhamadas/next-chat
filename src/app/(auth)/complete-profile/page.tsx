"use client"

import { Card } from "@/components/ui/card"
import ProfileForm from "@/features/user/components/profile-form"

const CompleteProfileForm = () => {
  return (
    <Card className="w-full gap-y-10 rounded-3xl px-9 pb-[60px] pt-10 flex-col-center">
      <h2 className="text-center font-bold h2">Complete Your Profile</h2>
      <ProfileForm onSubmit={() => {}} />
    </Card>
  )
}

export default CompleteProfileForm
