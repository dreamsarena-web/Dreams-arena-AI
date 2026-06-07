import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/shared/Navbar"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"]
})

export const metadata: Metadata = {
  title: "Dreams Arena AI - ساحة معارك الذكاء الاصطناعي",
  description: "قارن بين أقوى نماذج الذكاء الاصطناعي وصوّت للأفضل"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-dark-900 text-white antialiased`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
