"use client"

import { useEffect, useState } from "react"
import { AppSettings, fetchSettings } from "@/lib/store"

export default function Pricing() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [hours, setHours] = useState("00")
  const [minutes, setMinutes] = useState("10")
  const [seconds, setSeconds] = useState("00")
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s)
      const total = (s.countdownMinutes || 10) * 60 + (s.countdownSeconds || 0)
      startTimer(total)
    }).catch(() => {
      startTimer(10 * 60)
    })
  }, [])

  const startTimer = (initial: number) => {
    let total = initial
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    setHours(h < 10 ? "0" + h : String(h))
    setMinutes(m < 10 ? "0" + m : String(m))
    setSeconds(s < 10 ? "0" + s : String(s))

    const timer = setInterval(() => {
      if (total <= 0) {
        clearInterval(timer)
        setExpired(true)
        return
      }
      total--
      const hh = Math.floor(total / 3600)
      const mm = Math.floor((total % 3600) / 60)
      const ss = total % 60
      setHours(hh < 10 ? "0" + hh : String(hh))
      setMinutes(mm < 10 ? "0" + mm : String(mm))
      setSeconds(ss < 10 ? "0" + ss : String(ss))
    }, 1000)
  }

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200/80 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
        {/* Crown */}
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6">
          <i className="fa-solid fa-crown text-3xl animate-bounce"></i>
        </div>

        <div className="space-y-3">
          <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            MEGA LIFETIME BONUS
          </span>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900">
            Canva Premium <span className="text-gradient-canva">একদম ফ্রি!</span>
          </h3>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto font-medium">
            আমাদের বিশেষ &quot;৳৬৫০ অল-ইন-ওয়ান&quot; প্যাকেজটি অর্ডার করলে আপনি সম্পূর্ণ লাইফটাইমের জন্য ক্যানভা প্রিমিয়াম একাউন্ট পাবেন কোনো অতিরিক্ত ফি ছাড়াই!
          </p>
        </div>

        {/* Graphic Display Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 shadow-sm">
            <span className="text-emerald-600 text-xl"><i className="fa-solid fa-circle-check"></i></span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">হাজার হাজার প্রিমিয়াম টেমপ্লেট</h4>
              <p className="text-xs text-slate-500">যেকোনো সোশ্যাল মিডিয়া পোস্ট, ব্যানার বা ব্রোশার এক ক্লিকে এডিট করুন।</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 shadow-sm">
            <span className="text-emerald-600 text-xl"><i className="fa-solid fa-circle-check"></i></span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">ওয়ান-ক্লিক ব্যাকগ্রাউন্ড রিমুভার</h4>
              <p className="text-xs text-slate-500">এক ক্লিকেই যেকোনো ছবির ব্যাকগ্রাউন্ড ক্লিন করে ডিজাইন তৈরি করুন।</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 max-w-lg mx-auto space-y-4 shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-widest block">
            <i className="fa-regular fa-clock mr-1"></i> অফারটি শেষ হতে বাকি আছে:
          </span>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto text-center">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="block text-2xl font-extrabold text-slate-800">{hours}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Hours</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="block text-2xl font-extrabold text-slate-800">{minutes}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Minutes</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="block text-2xl font-extrabold text-slate-800">{seconds}</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Seconds</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center items-center">
              <span className="block text-base font-black text-emerald-600 animate-pulse">LIVE</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Status</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
