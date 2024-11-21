import { Open_Sans } from "next/font/google"

import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--open-sans",
})

export const metadata: Metadata = {
  title: "NextChat",
  description: "Next-Level Conversations, Anytime, Anywhere.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Toaster />

            {children}
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
