import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "১ লক্ষ ২০ হাজার+ টাকার Premium Course Bundle - মাত্র ৬৫০ টাকায়! | SkillsHQ",
  description: "ঘরে বসেই শিখুন ফ্রিল্যান্সিং, ভিডিও এডিটিং, ডিজিটাল মার্কেটিং এবং এআই মেকিং। সাথে লাইফটাইমের জন্য পাচ্ছেন প্রিমিয়াম সফটওয়্যার এবং রিসোর্সসমূহ!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
