"use client"

import { useState, useEffect } from "react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          if (data.loggedIn) setIsLoggedIn(true)
        }
      } catch {}
    }
    check()
  }, [])

  return (
    <>
      {/* Floating Sticky Order Button for Mobile */}
      <div className="fixed bottom-4 right-4 left-4 z-50 md:hidden">
        <a
          href="#checkout-section"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center font-bold py-3.5 rounded-xl shadow-2xl flex items-center justify-center gap-2 animate-bounce border border-white/20"
        >
          <i className="fa-solid fa-shopping-cart text-lg"></i>
          <span>অর্ডার করুন (৳৬৫০)</span>
        </a>
      </div>

      {/* Header Alert Ribbon */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-bold text-center py-2.5 px-4 text-xs md:text-sm tracking-wide shadow-md">
        <i className="fa-solid fa-triangle-exclamation mr-1.5 animate-pulse"></i>
        বিশেষ মেগা অফার: আজ রাত ১২টা পর্যন্ত সব কোর্স এবং Canva Premium একদম ফ্রি!
      </div>

      {/* Main Navigation/Brand Hero */}
      <header className="py-5 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/80 gap-4 bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 p-2.5 rounded-xl shadow-md">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider text-slate-900">
              SKILLS<span className="text-amber-500">HQ</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Premium Learning Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isLoggedIn ? (
            <a
              href="/dashboard"
              className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-5 rounded-lg transition text-xs shadow"
            >
              <i className="fa-solid fa-user mr-1.5"></i> ড্যাশবোর্ড
            </a>
          ) : (
            <a
              href="/login"
              className="hidden sm:inline-flex bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-5 rounded-lg transition text-xs"
            >
              <i className="fa-solid fa-right-to-bracket mr-1.5"></i> লগইন
            </a>
          )}
        </div>
      </header>
    </>
  )
}
