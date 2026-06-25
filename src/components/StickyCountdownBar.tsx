"use client"

import { useEffect, useState } from "react"
import { AppSettings, fetchSettings } from "@/lib/store"

export default function StickyCountdownBar() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExpired, setIsExpired] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s)
      startTimer((s.countdownMinutes || 10) * 60 + (s.countdownSeconds || 0))
    }).catch(() => {
      startTimer(10 * 60)
    })
  }, [])

  const startTimer = (initial: number) => {
    let total = initial
    setMinutes(Math.floor(total / 60))
    setSeconds(total % 60)

    const timer = setInterval(() => {
      if (total <= 0) {
        clearInterval(timer)
        setIsExpired(true)
        return
      }
      total--
      setMinutes(Math.floor(total / 60))
      setSeconds(total % 60)
    }, 1000)
  }

  if (!isVisible) return null

  const fmt = (n: number) => (n < 10 ? "0" + n : String(n))

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {isExpired ? (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 text-center shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <span className="text-sm md:text-base font-bold flex items-center gap-2">
              <i className="fa-solid fa-hourglass-end animate-pulse"></i>
              {settings?.offerEndMessage || "অফারটির মেয়াদ শেষ হয়ে গেছে!"}
            </span>
            <a
              href="#checkout-section"
              className="bg-white text-red-700 font-extrabold px-5 py-1.5 rounded-full text-xs hover:bg-red-50 transition shadow-md"
            >
              এখনই অর্ডার করুন
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-3 px-4 text-center shadow-2xl animate-glow">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            {/* Timer Section */}
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-fire text-white animate-bounce text-lg"></i>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
                ⚡ মেগা ফ্ল্যাশ সেল শেষ হতে বাকি:
              </span>
              <div className="flex items-center gap-1.5">
                <div className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-lg">
                  <span className="text-xl md:text-2xl font-black text-white tabular-nums">
                    {fmt(minutes)}
                  </span>
                </div>
                <span className="text-lg font-bold animate-pulse">:</span>
                <div className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-lg">
                  <span className="text-xl md:text-2xl font-black text-white tabular-nums">
                    {fmt(seconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full h-[28px]">
              {settings ? (
                <>
                  <span className="text-[10px] line-through text-white/60">{settings.bundleRegularPrice}</span>
                  <span className="text-sm font-black text-red-300">মাত্র {settings.bundlePrice}!</span>
                </>
              ) : (
                <div className="h-3.5 w-24 bg-white/20 animate-pulse rounded"></div>
              )}
            </div>

            {/* CTA */}
            <a
              href="#checkout-section"
              className="bg-red-500 text-white font-extrabold px-5 py-1.5 rounded-full text-xs hover:bg-red-600 transition shadow-lg inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-bolt"></i>
              এখনই কিনুন
            </a>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
