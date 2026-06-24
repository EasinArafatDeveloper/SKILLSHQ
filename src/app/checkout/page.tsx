"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Swal from "sweetalert2"
import { fetchSettings, AppSettings } from "@/lib/store"

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bkash")
  const [transactionId, setTransactionId] = useState("")
  const [screenshot, setScreenshot] = useState("")
  const [screenshotName, setScreenshotName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [settings, setSettings] = useState<AppSettings | null>(null)

  const bundlePrice = settings?.bundlePrice || "৳৬৫০"

  useEffect(() => {
    // Pre-fill from query params (coming from CTA)
    const qName = searchParams.get("name")
    const qPhone = searchParams.get("phone")
    const qEmail = searchParams.get("email")
    if (qName) setName(decodeURIComponent(qName))
    if (qPhone) setPhone(decodeURIComponent(qPhone))
    if (qEmail) setEmail(decodeURIComponent(qEmail))
    // Fetch dynamic price from settings
    fetchSettings().then(setSettings).catch(() => {})
  }, [searchParams])

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "ফাইল অনেক বড়!",
        text: "সর্বোচ্চ 5MB সাইজের ছবি আপলোড করতে পারবেন।",
        confirmButtonColor: "#D97706",
      })
      return
    }
    setScreenshotName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setScreenshot((reader.result as string) || "")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ট্রানজেকশন আইডি দিন",
        text: "অনুগ্রহ করে আপনার পেমেন্টের ট্রানজেকশন আইডি প্রদান করুন।",
        confirmButtonColor: "#D97706",
      })
      return
    }

    if (!screenshot) {
      Swal.fire({
        icon: "warning",
        title: "স্ক্রিনশট দিন",
        text: "অনুগ্রহ করে আপনার পেমেন্টের স্ক্রিনশট আপলোড করুন।",
        confirmButtonColor: "#D97706",
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          paymentMethod,
          amount: bundlePrice,
          transactionId: transactionId.trim(),
          screenshot,
          status: "pending",
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const data = await res.json()
      const orderId = data._id?.slice(-8).toUpperCase() || "SHQ-" + Date.now().toString(36).toUpperCase()

      Swal.fire({
        icon: "success",
        title: "অর্ডার সফল হয়েছে!",
        html: `
          <div class="text-left space-y-2 text-sm">
            <p class="text-slate-600">আপনার অর্ডারটি সফলভাবে জমা হয়েছে। আমাদের টিম শীঘ্রই ভেরিফাই করে আপনার ড্যাশবোর্ডে কোর্স লিংক দিয়ে দেবে।</p>
            <div class="bg-slate-50 p-3 rounded-lg mt-3 space-y-1.5 text-xs border">
              <div class="flex justify-between"><span class="text-slate-500">অর্ডার আইডি:</span> <span class="font-mono font-bold text-slate-800">#${orderId}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">পেমেন্ট মেথড:</span> <span class="font-medium text-slate-800">${paymentMethod === "bkash" ? "bKash" : "Nagad"}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">ট্রানজেকশন আইডি:</span> <span class="font-mono font-medium text-slate-800">${transactionId.trim()}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">মোট:</span> <span class="text-emerald-600 font-bold">${bundlePrice} BDT</span></div>
            </div>
          </div>
        `,
        confirmButtonText: "ড্যাশবোর্ডে যান",
        confirmButtonColor: "#059669",
        customClass: {
          popup: "!rounded-2xl !shadow-2xl",
          title: "!text-xl !font-black !text-slate-800",
        },
      }).then(() => {
        router.push("/dashboard")
      })
    } catch {
      Swal.fire({
        icon: "error",
        title: "সাবমিট করতে সমস্যা হয়েছে!",
        text: "অনুগ্রহ করে আবার চেষ্টা করুন।",
        confirmButtonColor: "#D97706",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-shield-halved mr-1"></i> Fast & Secure Order
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            পেমেন্ট কনফার্ম করুন
          </h1>
          <p className="text-sm text-slate-500">
            নিচের নাম্বারে টাকা পাঠিয়ে ট্রানজেকশন আইডি ও স্ক্রিনশট সাবমিট করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Personal Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i className="fa-solid fa-user-pen text-amber-500"></i> ১. আপনার তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                  সম্পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                ইমেইল এড্রেস <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
              <span className="text-[10px] text-slate-400 block mt-1">এই ইমেইল বা ফোন নম্বর দিয়ে পরবর্তীতে ড্যাশবোর্ডে লগইন করতে পারবেন।</span>
            </div>
          </div>

          {/* 2. Payment Numbers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-amber-500"></i> ২. টাকা পাঠানোর নাম্বার
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* bKash */}
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "bkash"
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-slate-200 hover:border-pink-300"
                }`}
                onClick={() => setPaymentMethod("bkash")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-extrabold text-sm">
                    bK
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">bKash</span>
                    <span className="text-[10px] text-slate-500">পার্সোনাল</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Send Money নাম্বার</span>
                  <span className="text-lg font-black text-slate-800 tracking-wider">01570278068</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText("01570278068")
                    Swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "success",
                      title: "bKash নাম্বার কপি হয়েছে!",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                    })
                  }}
                  className="mt-2 w-full text-[10px] font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-copy"></i> নাম্বার কপি করুন
                </button>
              </div>

              {/* Nagad */}
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "nagad"
                    ? "border-red-500 bg-red-50 shadow-md"
                    : "border-slate-200 hover:border-red-300"
                }`}
                onClick={() => setPaymentMethod("nagad")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-extrabold text-sm">
                    N
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">Nagad</span>
                    <span className="text-[10px] text-slate-500">পার্সোনাল</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Send Money নাম্বার</span>
                  <span className="text-lg font-black text-slate-800 tracking-wider">01570278068</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText("01570278068")
                    Swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "success",
                      title: "Nagad নাম্বার কপি হয়েছে!",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                    })
                  }}
                  className="mt-2 w-full text-[10px] font-bold text-red-600 bg-red-100 hover:bg-red-200 py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-copy"></i> নাম্বার কপি করুন
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
              <i className="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
              <p className="text-[11px] text-amber-800 font-medium">
                উপরের bKash অথবা Nagad নাম্বারে <strong>{bundlePrice}</strong> টাকা Send Money করুন। তারপর নিচে ট্রানজেকশন আইডি ও স্ক্রিনশট দিন।
              </p>
            </div>
          </div>

          {/* 3. Transaction Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i className="fa-solid fa-receipt text-amber-500"></i> ৩. পেমেন্ট তথ্য দিন
            </h2>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                ট্রানজেকশন আইডি (Transaction ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="যেমন: TxnID1234567890"
                required
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                {paymentMethod === "bkash" ? "bKash" : "Nagad"} অ্যাপ থেকে Send Money-র পর যে ট্রানজেকশন আইডি পেয়েছেন সেটি দিন।
              </span>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                পেমেন্ট স্ক্রিনশট আপলোড করুন <span className="text-red-500">*</span>
              </label>

              <label
                className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                  screenshot
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-300 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
              >
                {screenshot ? (
                  <>
                    <i className="fa-solid fa-circle-check text-emerald-600 text-2xl"></i>
                    <span className="text-xs font-bold text-emerald-700">স্ক্রিনশট আপলোড হয়েছে</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{screenshotName}</span>
                    <span className="text-[10px] text-amber-600 font-medium mt-1">পরিবর্তন করতে আবার ক্লিক করুন</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-2xl"></i>
                    <span className="text-xs font-bold text-slate-600">ক্লিক করে স্ক্রিনশট আপলোড করুন</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG (Max 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 4. Order Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-amber-500"></i> ৪. অর্ডার সামারি
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>প্রোডাক্ট</span>
                <span className="font-medium text-slate-800">মেগা অল-ইন-ওয়ান বান্ডেল</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>পেমেন্ট মেথড</span>
                <span className="font-medium text-slate-800">{paymentMethod === "bkash" ? "bKash" : "Nagad"}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                <span>পরিশোধযোগ্য মূল্য:</span>
                <span className="text-emerald-600 text-lg font-black">{bundlePrice} BDT</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 accent-amber-500"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-500 leading-normal font-medium cursor-pointer">
              আমি সঠিক তথ্য প্রদান করেছি এবং পেমেন্ট সংক্রান্ত সকল শর্ত মেনে নিচ্ছি।
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3.5 px-6 rounded-lg text-sm transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 border-b-4 border-amber-700 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner animate-spin text-base"></i>
                <span>সাবমিট হচ্ছে...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane text-base"></i>
                <span>পেমেন্ট কনফার্ম করুন</span>
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 text-center font-medium">
            <div className="flex items-center justify-center gap-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <i className="fa-solid fa-lock text-emerald-600 text-xs"></i>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <i className="fa-solid fa-headset text-emerald-600 text-xs"></i>
              <span>২৪/৭ সাপোর্ট</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Wrap in Suspense for useSearchParams
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="text-center space-y-3">
            <i className="fa-solid fa-spinner animate-spin text-amber-500 text-3xl"></i>
            <p className="text-slate-500 text-sm font-medium">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  )
}
