import { PropsWithChildren } from "react"

import Image from "next/image"

import { I18nProviderClient } from "@/lib/locale/client"
import { getScopedI18n } from "@/lib/locale/server"

const AuthLayout = async ({
  children,
  params,
}: PropsWithChildren & { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const t = await getScopedI18n("auth")

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden w-full max-w-[600px] bg-primary px-16 pt-16 lg:flex-col-center">
        <div className="mx-auto flex flex-col text-white">
          <Image
            src="/images/logo/logo-with-text-white.svg"
            alt="logo"
            width={251}
            height={57}
          />
          <div className="mt-8">
            <h1 className="h1">{t("info.title")}</h1>
            <p className="mt-4 body-1">{t("info.desc")}</p>
          </div>
          <Image
            src="/images/message-illustration.svg"
            alt="message"
            width={480}
            height={480}
            className="aspect-square w-[400px]"
          />
        </div>
      </div>
      <div className="h-screen w-full overflow-y-auto px-4 pb-12 pt-24 flex-col-center sm:px-8 lg:px-12 lg:py-20">
        <Image
          className="mb-6 w-20 md:w-24 lg:hidden"
          src="/images/logo/logo.svg"
          alt="logo"
          width={96}
          height={96}
        />
        <I18nProviderClient locale={locale}>
          <main className="w-full max-w-[500px] lg:my-auto">{children}</main>
        </I18nProviderClient>
      </div>
    </div>
  )
}

export default AuthLayout
