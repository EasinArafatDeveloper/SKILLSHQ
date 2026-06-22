"use client"

import { useEffect, useState } from "react"
import { AppSettings, fetchSettings } from "@/lib/store"

export default function FloatingContact() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
  }, [])

  const waNumber = settings?.whatsappNumber || ""
  const tgLink = settings?.telegramLink || ""
  const hasWA = waNumber.length > 5
  const hasTG = tgLink.length > 5

  const waLink = hasWA
    ? `https://wa.me/${waNumber.replace(/\+/g, "")}?text=আসসালামু আলাইকুম! প্রিমিয়াম কোর্স বান্ডেলটি কিনতে চাই।`
    : "#contact"

  return (
    <div className="fixed bottom-20 md:bottom-8 right-3 md:right-5 z-[70] flex flex-col gap-2.5">
      {/* WhatsApp Button */}
      <div
        className="relative group"
        onMouseEnter={() => setHovered("wa")}
        onMouseLeave={() => setHovered(null)}
      >
        {hovered === "wa" && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap border border-slate-200">
            <span className="text-green-600">WhatsApp</span>
            {hasWA && <span className="block text-[10px] text-slate-400 font-normal">{waNumber}</span>}
            {!hasWA && <span className="block text-[10px] text-red-400 font-normal">সেট করা হয়নি</span>}
          </span>
        )}
        <a
          href={hasWA ? waLink : "#"}
          onClick={(e) => { if (!hasWA) e.preventDefault() }}
          target={hasWA ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="w-[52px] h-[52px] md:w-[56px] md:h-[56px] bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center text-2xl md:text-[26px] transition-all duration-300 hover:scale-110 active:scale-95 relative"
          title={hasWA ? "WhatsApp এ কথা বলুন" : "WhatsApp নাম্বার সেট করা হয়নি"}
        >
          <i className="fa-brands fa-whatsapp"></i>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
          <span className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-20"></span>
        </a>
      </div>

      {/* Telegram Button */}
      <div
        className="relative group"
        onMouseEnter={() => setHovered("tg")}
        onMouseLeave={() => setHovered(null)}
      >
        {hovered === "tg" && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap border border-slate-200">
            <span className="text-sky-600">Telegram</span>
            {hasTG && <span className="block text-[10px] text-slate-400 font-normal">{tgLink.replace("https://t.me/", "@")}</span>}
            {!hasTG && <span className="block text-[10px] text-red-400 font-normal">সেট করা হয়নি</span>}
          </span>
        )}
        <a
          href={hasTG ? tgLink : "#"}
          onClick={(e) => { if (!hasTG) e.preventDefault() }}
          target={hasTG ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="w-[52px] h-[52px] md:w-[56px] md:h-[56px] bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center text-2xl md:text-[26px] transition-all duration-300 hover:scale-110 active:scale-95"
          title={hasTG ? "Telegram এ যোগ দিন" : "Telegram লিংক সেট করা হয়নি"}
        >
          <i className="fa-brands fa-telegram"></i>
          <span className="absolute inset-0 rounded-2xl bg-sky-400 animate-ping opacity-15"></span>
        </a>
      </div>
    </div>
  )
}
