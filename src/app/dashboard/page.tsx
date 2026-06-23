"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"

interface PrivateLink {
  courseTitle: string
  link: string
  unlockedAt?: string
  _id: string
}

interface DashboardData {
  _id: string
  name: string
  email: string
  phone: string
  status: string
  transactionId: string
  amount: string
  paymentMethod: string
  createdAt: string
  privateLinks: PrivateLink[]
  telegramLink: string
  isCompleted: boolean
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loginInput, setLoginInput] = useState("")
  const [loginType, setLoginType] = useState<"email" | "phone">("email")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const res = await fetch("/api/auth/me")
        if (!cancelled && res.ok) {
          const user = await res.json()
          if (user.loggedIn) {
            // auth/me now returns full dashboard data
            setData(user)
          }
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setCheckingAuth(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const handleLogin = async () => {
    if (!loginInput.trim()) {
      setLoginError("ইমেইল অথবা ফোন নম্বর দিন")
      return
    }
    setLoginLoading(true)
    setLoginError("")
    try {
      const body =
        loginType === "email"
          ? { email: loginInput.trim() }
          : { phone: loginInput.trim() }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await res.json()
      if (res.ok && result.success) {
        // Login API now returns full dashboard data directly
        setData(result)
      } else {
        setLoginError(result.error || "লগইন করতে সমস্যা হয়েছে")
      }
    } catch {
      setLoginError("লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" })
    setData(null)
    setLoginInput("")
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "লগআউট হয়েছে",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: { popup: "!rounded-xl" },
    })
  }

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "লিংক কপি হয়েছে!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: { popup: "!rounded-xl" },
      })
    } catch {
      const input = document.createElement("input")
      input.value = link
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
    }
  }

  // ---- DASHBOARD VIEW (logged in) ----
  if (data) {
    const isPending = data.status === "pending"
    const isCancelled = data.status === "cancelled"
    const isCompleted = data.isCompleted

    return (
      <div className="min-h-screen bg-slate-100">
        <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
              </div>
              <span className="font-black text-slate-800 text-sm">SkillsHQ Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:block">{data.name}</span>
              <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1">
                <i className="fa-solid fa-right-from-bracket"></i> লগআউট
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-user text-amber-500"></i> আপনার তথ্য
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">নাম</span><p className="text-sm font-bold text-slate-800">{data.name}</p></div>
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">ইমেইল</span><p className="text-sm font-bold text-slate-800">{data.email}</p></div>
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">ফোন</span><p className="text-sm font-bold text-slate-800">{data.phone}</p></div>
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">অর্ডার স্ট্যাটাস</span>
                <span className={"inline-block text-xs font-bold px-2.5 py-1 rounded-full ml-1 " + (isCompleted ? "bg-emerald-100 text-emerald-700" : isCancelled ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                  {isCompleted ? "✅ কমপ্লিট" : isCancelled ? "❌ ক্যান্সেল" : "⏳ পেন্ডিং"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">পেমেন্ট মেথড</span><p className="text-sm font-bold text-slate-800 uppercase">{data.paymentMethod}</p></div>
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">ট্রানজেকশন আইডি</span><p className="text-sm font-mono font-bold text-slate-800">{data.transactionId || "—"}</p></div>
              <div><span className="text-[10px] text-slate-500 uppercase font-bold">পরিমাণ</span><p className="text-sm font-bold text-emerald-600">{data.amount}</p></div>
            </div>
          </div>

          {isPending && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto"><i className="fa-solid fa-clock text-amber-600 text-xl"></i></div>
              <h3 className="text-lg font-black text-amber-800">আপনার পেমেন্ট ভেরিফিকেশন পেন্ডিং!</h3>
              <p className="text-sm text-amber-700 max-w-md mx-auto">আমাদের টিম আপনার পেমেন্ট ভেরিফাই করছে। ভেরিফিকেশন কমপ্লিট হলে এখানেই আপনার কোর্সের সকল লিংক দেখতে পাবেন।</p>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto"><i className="fa-solid fa-xmark text-red-600 text-xl"></i></div>
              <h3 className="text-lg font-black text-red-800">আপনার অর্ডার ক্যান্সেল হয়েছে</h3>
              <p className="text-sm text-red-700 max-w-md mx-auto">দুঃখিত, আপনার অর্ডারটি ক্যান্সেল করা হয়েছে। নতুন করে অর্ডার করতে আমাদের সাথে যোগাযোগ করুন।</p>
            </div>
          )}

          {isCompleted && (
            <>
              {data.telegramLink ? (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><i className="fa-brands fa-telegram text-xl"></i></div>
                    <div><h3 className="font-black text-lg">টেলিগ্রাম গ্রুপে জয়েন করুন</h3><p className="text-xs text-blue-100">কমিউনিটির সাথে যুক্ত হতে নিচের বাটনে ক্লিক করুন</p></div>
                  </div>
                  <button onClick={() => window.open(data.telegramLink, "_blank", "noopener,noreferrer")} className="w-full bg-white text-blue-600 font-extrabold py-3 rounded-xl hover:bg-blue-50 transition text-sm flex items-center justify-center gap-2">
                    <i className="fa-brands fa-telegram"></i> টেলিগ্রাম গ্রুপে জয়েন করুন <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
                  </button>
                </div>
              ) : null}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2"><i className="fa-solid fa-lock-keyhole text-emerald-500"></i> আপনার আনলকড কোর্সসমূহ</h2>
                <p className="text-xs text-slate-500 mb-5">নিচের প্রতিটি কোর্সের লিংক শুধুমাত্র আপনার জন্যই আনলক করা হয়েছে। কাউকে শেয়ার করবেন না।</p>
                {!data.privateLinks || data.privateLinks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400"><i className="fa-solid fa-folder-open text-3xl mb-2 block"></i><p className="text-sm">এখনো কোনো কোর্স আনলক করা হয়নি। আমাদের টিম শীঘ্রই লিংক যুক্ত করবে।</p></div>
                ) : (
                  <div className="grid gap-3">
                    {data.privateLinks.map((item, idx) => (
                      <div key={item._id || idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-link text-emerald-600 text-sm"></i></span>
                          <div className="min-w-0"><h4 className="text-sm font-bold text-slate-800 truncate">{item.courseTitle}</h4><p className="text-[10px] text-slate-400">আনলক হয়েছে</p></div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => copyLink(item.link)} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"><i className="fa-solid fa-copy"></i> কপি</button>
                          <button onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"><i className="fa-solid fa-arrow-up-right-from-square"></i> ওপেন</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-slate-200/50 rounded-2xl border border-slate-300 p-4 text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5"><i className="fa-solid fa-shield-halved text-slate-400"></i>এই পেজের সকল লিংক সুরক্ষিত। এগুলো কেবলমাত্র আপনার অ্যাকাউন্ট থেকেই দেখা সম্ভব।</p>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ---- LOADING: checking auth ----
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-amber-500"></i>
          <p className="text-xs text-slate-400">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  // ---- LOGIN SCREEN (not logged in) ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <i className="fa-solid fa-user-check text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900">আপনার <span className="text-emerald-500">ড্যাশবোর্ড</span></h1>
          <p className="text-xs text-slate-500">আপনার ইমেইল অথবা ফোন নম্বর দিয়ে লগইন করুন</p>
        </div>

        <div className="space-y-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => { setLoginType("email"); setLoginError("") }} className={"flex-1 py-2 text-xs font-bold rounded-md transition " + (loginType === "email" ? "bg-white shadow text-slate-800" : "text-slate-500")}>
              <i className="fa-solid fa-envelope mr-1.5"></i> ইমেইল
            </button>
            <button onClick={() => { setLoginType("phone"); setLoginError("") }} className={"flex-1 py-2 text-xs font-bold rounded-md transition " + (loginType === "phone" ? "bg-white shadow text-slate-800" : "text-slate-500")}>
              <i className="fa-solid fa-mobile-screen mr-1.5"></i> ফোন
            </button>
          </div>

          <input type={loginType === "email" ? "email" : "tel"} value={loginInput}
            onChange={(e) => { setLoginInput(e.target.value); setLoginError("") }}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
            placeholder={loginType === "email" ? "example@email.com" : "01XXXXXXXXX"}
            className="w-full border border-slate-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" autoFocus />

          {loginError ? (
            <p className="text-red-500 text-xs font-medium flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {loginError}</p>
          ) : null}

          <button onClick={handleLogin} disabled={loginLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3 rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {loginLoading ? (<><i className="fa-solid fa-spinner animate-spin"></i> লগইন হচ্ছে...</>) : (<><i className="fa-solid fa-right-to-bracket"></i> লগইন করুন</>)}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center">শুধুমাত্র রেজিস্টার্ড ইউজাররাই লগইন করতে পারবেন</p>
      </div>
    </div>
  )
}
