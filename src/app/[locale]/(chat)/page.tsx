import Image from "next/image"

import { getScopedI18n } from "@/lib/locale/server"

export default async function Home() {
  const t = await getScopedI18n("room")

  return (
    <div className="hidden h-screen flex-1 md:flex-center">
      <div className="gap-y-6 flex-col-center">
        <Image
          priority
          src="/images/no-message.svg"
          alt="no conversation"
          width={200}
          height={169}
          className="h-auto w-28 lg:w-32"
        />
        <div className="gap-y-2 flex-col-center">
          <h4 className="h4">{t("no_selected")}</h4>
          <p className="body-2">{t("no_selected_body")}</p>
        </div>
      </div>
    </div>
  )
}
