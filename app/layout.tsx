import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AuraCompass - Your AI-Guided Emotional Navigator",
  description: "Not just an app — your mirror, mentor, and mental co-pilot.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Suspense fallback={null}>{children}</Suspense>
        </Suspense>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
