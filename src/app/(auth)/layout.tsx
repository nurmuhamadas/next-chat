import { PropsWithChildren } from "react"

import Image from "next/image"

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen">
      <div className="hidden w-full max-w-[600px] bg-primary px-16 pt-16 lg:flex-col-center">
        <div className="mx-auto flex flex-col text-white">
          <Image
            src="/images/logo/logo-with-text-white.svg"
            alt="logo"
            width={251}
            height={57}
          />
          <div className="mt-8">
            <h1 className="text-h1">
              Next-Level Conversations, Anytime, Anywhere.
            </h1>
            <p className="mt-4 text-body-1">
              NextChat is a secure, easy-to-use messaging app for seamless
              conversations and media sharing.
            </p>
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
      <div className="w-full overflow-y-auto px-4 pt-32 flex-col-center sm:px-8 lg:justify-center lg:px-12 lg:py-20">
        <Image
          className="lg:hidden"
          src="/images/logo/logo.svg"
          alt="logo"
          width={96}
          height={96}
        />
        <main className="w-full max-w-[500px]">{children}</main>
      </div>
    </div>
  )
}

export default AuthLayout
