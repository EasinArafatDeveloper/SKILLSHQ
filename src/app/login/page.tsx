"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function LoginPage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [type, setType] = useState<"email" | "phone">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!input.trim()) {
      setError("ইমেইল অথবা ফোন নম্বর দিন")
      return
    }
    setLoading(true)
    setError("")
    try {
      const body = type === "email" ? { email: input.trim() } : { phone: input.trim() }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "লগইন সফল!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: { popup: "!rounded-xl" },
        })
        router.push("/dashboard")
      } else {
        setError(result.error || "লগইন করতে সমস্যা হয়েছে")
      }
    } catch {
      setError("লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <i className="fa-solid fa-right-to-bracket text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            লগ<span className="text-amber-500">ইন</span>
          </h1>
          <p className="text-xs text-slate-500">
            আপনার ইমেইল অথবা ফোন নম্বর দিয়ে লগইন করুন
          </p>
        </div>

        <div className="space-y-3">
          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => { setType("email"); setError("") }}
              className={"flex-1 py-2 text-xs font-bold rounded-md transition " + (type === "email" ? "bg-white shadow text-slate-800" : "text-slate-500")}
            >
              <i className="fa-solid fa-envelope mr-1.5"></i> ইমেইল
            </button>
            <button
              onClick={() => { setType("phone"); setError("") }}
              className={"flex-1 py-2 text-xs font-bold rounded-md transition " + (type === "phone" ? "bg-white shadow text-slate-800" : "text-slate-500")}
            >
              <i className="fa-solid fa-mobile-screen mr-1.5"></i> ফোন
            </button>
          </div>

          <input
            type={type === "email" ? "email" : "tel"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError("") }}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
            placeholder={type === "email" ? "example@email.com" : "01XXXXXXXXX"}
            className="w-full border border-slate-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            autoFocus
          />

          {error ? (
            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </p>
          ) : null}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> লগইন হচ্ছে...</>
            ) : (
              <><i className="fa-solid fa-right-to-bracket"></i> লগইন করুন</>
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          অর্ডার করার পর আপনার ইমেইল বা ফোন নম্বর দিয়ে লগইন করতে পারবেন
        </p>
      </div>
    </div>
  )
}
