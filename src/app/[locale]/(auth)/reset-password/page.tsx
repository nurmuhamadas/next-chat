import Link from "next/link"

import { Button } from "@/components/ui/button"
import ResetPasswordForm from "@/features/auth/components/reset-password-form"
import { useScopedI18n } from "@/lib/locale/client"

const ResetPasswordPage = () => {
  const t = useScopedI18n("auth.reset_password")

  return (
    <div className="w-full gap-y-9 flex-col-center">
      <h2 className="text-center font-bold h2 md:text-[36px]">{t("title")}</h2>
      <ResetPasswordForm />
      <p className="text-center body-2">
        {t("back")}
        <Button variant="link" className="ml-2 px-0" asChild>
          <Link href="/sign-in">{t("link")}</Link>
        </Button>
      </p>
    </div>
  )
}

export default ResetPasswordPage
