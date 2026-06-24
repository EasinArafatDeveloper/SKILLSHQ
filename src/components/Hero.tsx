"use client"

import { useEffect, useState } from "react"
import { AppSettings, fetchSettings } from "@/lib/store"

export default function Hero() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
  }, [])

  const videoUrl = settings?.videoUrl || ""
  const videoTitle = settings?.videoTitle || "কিভাবে এই সিঙ্গেল বান্ডেল আপনার লাইফ পরিবর্তন করতে পারে?"
  const videoThumbnail = settings?.videoThumbnail || ""

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : ""
  }

  const hasVideo = videoUrl.length > 5
  const hasThumbnail = videoThumbnail.length > 5

  return (
    <section className="relative pt-12 pb-16 px-4 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Soft Background Ambient Lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-10 left-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs md:text-sm font-semibold tracking-wide">
          <i className="fa-solid fa-fire text-amber-500 animate-pulse"></i> ১ লক্ষ ২০ হাজার+ টাকার প্রিমিয়াম কোর্স ও লাইসেন্সড টুলস
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
          আপনার ক্যারিয়ারকে করুন সুপারচার্জ, <br />
          <span className="text-gradient-gold">সবচেয়ে প্রিমিয়াম বান্ডেল</span> এখন হাতের মুঠোয়!
        </h2>

        {/* Subheading */}
        <p className="text-slate-600 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
          ঘরে বসেই শিখুন ফ্রিল্যান্সিং, ভিডিও এডিটিং, ডিজিটাল মার্কেটিং এবং এআই মেকিং। সাথে লাইফটাইমের জন্য পাচ্ছেন অত্যন্ত মূল্যবান প্রিমিয়াম সফটওয়্যার এবং রিসোর্সসমূহ!
        </p>

        {/* Video Section */}
        <div className="pt-6 max-w-3xl mx-auto">
          {!showVideo ? (
            /* Thumbnail / Play Button */
            <div className="relative p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden group">
              <div
                className="aspect-video w-full rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center"
                style={
                  hasThumbnail
                    ? { backgroundImage: `url(${videoThumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : {}
                }
              >
                {/* Light overlay for play button visibility */}
                {hasThumbnail ? (
                  <div className="absolute inset-0 bg-black/20"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
                )}
                {/* Centered Play Button Only - No Text */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <i className="fa-solid fa-play text-amber-500 text-2xl md:text-3xl ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Video Player */
            <div className="relative p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative">
                {hasVideo && getYouTubeId(videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&rel=0`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={videoTitle}
                  ></iframe>
                ) : hasVideo ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                  ></video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p className="text-sm text-slate-400">ভিডিও পাওয়া যায়নি</p>
                  </div>
                )}
                {/* Close Button */}
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <span className="block text-2xl md:text-3xl font-extrabold text-amber-600">৳১২০K+</span>
            <span className="text-xs text-slate-500 font-medium">সর্বমোট ভ্যালু</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <span className="block text-2xl md:text-3xl font-extrabold text-emerald-600">{settings?.bundlePrice || "৳৬৫০"}</span>
            <span className="text-xs text-slate-500 font-medium">আজকের বিশেষ অফার</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <span className="block text-2xl md:text-3xl font-extrabold text-indigo-600">১০+</span>
            <span className="text-xs text-slate-500 font-medium">প্রিমিয়াম প্রোডাক্টস</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <span className="block text-2xl md:text-3xl font-extrabold text-sky-600">4.9 ★</span>
            <span className="text-xs text-slate-500 font-medium">ব্যবহারকারী রেটিং</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#checkout-section"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 border-b-4 border-amber-700"
          >
            <span>আজই সম্পূর্ণ বান্ডেলটি নিন</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
          {!showVideo && (
            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-500 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all duration-300"
            >
              <i className="fa-solid fa-circle-play text-lg"></i>
              <span>ভিডিও দেখুন</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
          <i className="fa-solid fa-clock text-amber-600"></i> মাত্র ২৪ ঘণ্টা এই ডিসকাউন্ট অফারটি কার্যকর থাকবে!
        </p>
      </div>
    </section>
  )
}
