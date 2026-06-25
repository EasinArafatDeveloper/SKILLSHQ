"use client"

import { useState, useEffect } from "react"
import { Course, fetchCourses, fetchSettings, AppSettings, getCourses, getSettings } from "@/lib/store"

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [c, s] = await Promise.all([fetchCourses(), fetchSettings()])
        setCourses(c)
        setSettings(s)
      } catch {
        // fallback to localStorage if API fails
        setCourses(getCourses())
        setSettings(getSettings())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      course.title.toLowerCase().includes(term) ||
      course.desc.toLowerCase().includes(term)
    )
  })

  const bundlePrice = settings?.bundlePrice || "৳৬৫০"
  const bundleRegularPrice = settings?.bundleRegularPrice || "৳১,২০,০০০"

  // Calculate ACTUAL total of all course offer prices
  const calcTotal = courses.reduce((sum, c) => {
    // Convert Bengali digits to ASCII: ০১২৩৪৫৬৭৮৯ -> 0123456789
    const price = (c.offerPrice || "").replace(/[০-৯]/g, (d) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(d))
    ).replace(/[^0-9]/g, "")
    const num = parseInt(price)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
  const totalOfferSum = calcTotal > 0 ? `৳${calcTotal.toLocaleString("en-US")}` : bundleRegularPrice

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Course Syllabus & Catalog</span>
        <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900">কি কি স্কিল ও প্রোডাক্ট পাচ্ছেন দেখে নিন</h3>
        <p className="text-sm text-slate-500">নিচে আমাদের এই প্রিমিয়াম বান্ডেলের সম্পূর্ণ প্রোডাক্ট ক্যাটালগ ও তাদের রেগুলার বনাম ডিসকাউন্ট মূল্যের তালিকা দেওয়া হলো:</p>
      </div>

      {/* Container */}
      <div className="premium-card rounded-2xl overflow-hidden border border-slate-200">
        {/* Search */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm font-semibold text-slate-800">
            সর্বমোট আইটেম:{" "}
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">১০+ মেগা কোর্স ও রিসোর্স</span>
          </span>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="কোর্স খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition shadow-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
          </div>
        </div>

        {/* ===== DESKTOP TABLE (md+) ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">আইকন</th>
                <th className="py-4 px-6">স্কিল ও কোর্সের নাম (Skill & Course Name)</th>
                <th className="py-4 px-6 text-right w-36">নরমাল মূল্য (Regular)</th>
                <th className="py-4 px-6 text-right w-36">বিশেষ অফার (Offer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCourses.map((course, index) => (
                <tr
                  key={index}
                  className={`hover:bg-slate-50/50 transition duration-150 ${
                    course.highlight ? "bg-amber-500/5 border-l-4 border-amber-500" : ""
                  }`}
                >
                  <td className="py-4 px-6 text-center text-xl">
                    <i className={`fa-solid ${course.icon} ${course.iconColor}`}></i>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block">{course.title}</span>
                    <span className="text-xs text-slate-500 font-medium">{course.desc}</span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400 line-through">{course.regularPrice}</td>
                  <td className="py-4 px-6 text-right font-extrabold text-emerald-600">{course.offerPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS (< md) ===== */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className={`p-4 hover:bg-slate-50/50 transition duration-150 ${
                course.highlight ? "bg-amber-500/5 border-l-4 border-amber-500" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg ${course.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <i className={`fa-solid ${course.icon} ${course.iconColor} text-lg`}></i>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">{course.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{course.desc}</p>
                  {/* Price Row - side by side, no overflow */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-400 line-through">{course.regularPrice}</span>
                    <span className="text-base font-extrabold text-emerald-600">{course.offerPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <i className="fa-solid fa-magnifying-glass text-3xl mb-2 block"></i>
            <p className="text-sm">কোনো কোর্স পাওয়া যায়নি</p>
          </div>
        )}

        {/* Table CTA - 3 Tier Pricing */}
        <div className="bg-slate-50 p-6 text-center space-y-4 border-t border-slate-200">
          {/* Regular Total (big crossed out) */}
          <p className="text-xs md:text-sm text-slate-500">
            রেগুলার সর্বমোট মূল্য{" "}
            <span className="text-slate-400 line-through font-bold">{bundleRegularPrice}+ BDT</span>
          </p>
          {/* Individual Offer Sum (calculated) */}
          <div className="text-sm md:text-base text-slate-600 font-bold flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 pb-1">
            <span>আলাদা আলাদা অফার কিনলে:</span>
            <span className="cross-out-price text-slate-800 font-black px-3 text-3xl md:text-4xl leading-none">
              {totalOfferSum} BDT
            </span>
          </div>
          {/* Mega Bundle Offer (RED) */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 pt-3 pb-2">
            <span className="text-xl md:text-2xl font-black text-slate-800">আজকের অল-ইন-ওয়ান মেগা অফার:</span>
            <span className="relative inline-block px-6 py-2.5">
              <span className="relative z-10 text-3xl md:text-4xl font-black text-red-500 block h-[40px] flex items-center justify-center">
                {settings ? (
                  <span className="animate-pulse">মাত্র {settings.bundlePrice} BDT!</span>
                ) : (
                  <span className="inline-block h-8 w-44 bg-slate-200 animate-pulse rounded"></span>
                )}
              </span>
              <svg className="absolute inset-0 w-[108%] h-[112%] -left-[4%] -top-[6%] pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 3 50 C 3 12, 97 12, 97 50 C 97 88, 3 88, 5 54"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-draw-circle"
                />
              </svg>
            </span>
          </div>
          <a
            href="#checkout-section"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-extrabold px-8 py-3 rounded-lg text-sm tracking-wider transition shadow-md shadow-red-500/10 border-b-2 border-red-700"
          >
            এখনি পুরো বান্ডেল অর্ডার করুন
          </a>
        </div>
      </div>
    </section>
  )
}
