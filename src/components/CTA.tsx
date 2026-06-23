"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CTA() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("fullname") as HTMLInputElement)?.value.trim()
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value.trim()
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim()

    if (name && phone && email) {
      setSubmitting(true)
      // Redirect to checkout page with user data
      const params = new URLSearchParams({ name, phone, email })
      router.push(`/checkout?${params.toString()}`)
    }
  }

  return (
    <>
      <section id="checkout-section" className="py-16 bg-slate-100 border-t border-slate-200 px-4 scroll-mt-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Fast & Secure Order</span>
            <h3 className="text-3xl font-black text-slate-900">অর্ডার করতে নিচের ফর্মটি পূরণ করুন</h3>
            <p className="text-sm text-slate-500">মাত্র ১ মিনিটেই আপনার পেমেন্ট শেষ করে ড্রাইভ অ্যাক্সেস নিন।</p>
          </div>

          {/* Two Column Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Billing Information */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <i className="fa-solid fa-user-pen text-amber-500"></i> ১. আপনার বিবরণী
              </h4>

              <form id="orderForm" className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                    আপনার সম্পূর্ণ নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="নাম টাইপ করুন..."
                    required
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="মোবাইল নম্বর টাইপ করুন..."
                    required
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1.5 font-bold">
                    আপনার ইমেইল <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="আপনার কার্যকর ইমেইল এড্রেস..."
                    required
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">এই ইমেইলেই আপনার ড্রাইভ ফোল্ডারের অ্যাক্সেস পাঠানো হবে।</span>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" id="terms" required className="mt-1 accent-amber-500" />
                  <label htmlFor="terms" className="text-[10px] text-slate-500 leading-normal font-medium cursor-pointer">
                    আমি সম্পূর্ণ অফারের বিবরণ পড়েছি এবং কোর্স কেনার সমস্ত শর্তাবলী মেনে নিতে সম্মত আছি।
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3.5 px-6 rounded-lg text-sm transition shadow-lg tracking-wide shadow-amber-500/10 flex items-center justify-center gap-2 border-b-4 border-amber-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <><i className="fa-solid fa-spinner animate-spin text-base"></i><span>প্রসেসিং...</span></>
                  ) : (
                    <><i className="fa-solid fa-circle-check text-base"></i><span>পেমেন্ট করুন ও অ্যাক্সেস নিন</span></>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-amber-500"></i> ২. আপনার অর্ডার সামারি
                </h4>

                {/* Bundle Toggle */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border-2 border-emerald-500 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                      <div>
                        <span className="block text-xs font-extrabold text-slate-900">মেগা অল-ইন-ওয়ান বান্ডেল</span>
                        <span className="text-[10px] text-emerald-700 font-bold">সবচেয়ে জনপ্রিয় চয়েস</span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600">৳৬৫০ BDT</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-medium">সম্পূর্ণ বান্ডেল কিনলেই কেবল Canva Premium ফ্রি অফারটি প্রযোজ্য হবে।</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>সর্বমোট ১০+ প্রিমিয়াম প্রোডাক্ট</span>
                    <span className="line-through text-slate-400">৳১,২০,০০০</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>ক্যাম্পেইন ডিসকাউন্ট</span>
                    <span className="text-red-500">-৳১,১৯,৩৫০</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Canva Premium বোনাস</span>
                    <span className="text-emerald-600 font-bold">ফ্রি (FREE)</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>সার্ভিস বা ভ্যাট চার্জ</span>
                    <span>৳০</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
                    <span>পরিশোধযোগ্য মোট মূল্য:</span>
                    <span className="text-lg text-emerald-600 font-black">৳৬৫০ BDT</span>
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200 mt-6">
                <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-widest text-center">নিরাপত্তা ও গ্যারান্টি</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 text-center font-medium">
                  <div className="flex flex-col items-center justify-center p-2 rounded bg-white border border-slate-200 shadow-xs">
                    <i className="fa-solid fa-lock text-emerald-600 text-sm mb-1"></i>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded bg-white border border-slate-200 shadow-xs">
                    <i className="fa-solid fa-headset text-emerald-600 text-sm mb-1"></i>
                    <span>২৪/৭ সাপোর্ট</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
