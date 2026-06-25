import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/models/Course"
import { SettingsModel } from "@/models/Settings"
import { RegistrationModel } from "@/models/Registration"
import { FaqModel } from "@/models/Faq"

const REAL_COURSES = [
  { courseId: "1", icon: "fa-robot", iconColor: "text-amber-500", bgColor: "bg-amber-50", title: "AI কনটেন্ট ক্রিয়েশন ওয়ার্কশপ ফুল কোর্স", desc: "এআই টুল দিয়ে প্রফেশনাল কনটেন্ট রাইটিং, ইমেজ ও ভিডিও ক্রিয়েশন শিখুন", regularPrice: "৳৮,০০০", offerPrice: "৳৪০০", highlight: false, order: 1 },
  { courseId: "2", icon: "fa-volume-high", iconColor: "text-sky-500", bgColor: "bg-sky-50", title: "IELTS (Spoken English) Course", desc: "ঘরে বসে ফ্লুয়েন্টলি ইংলিশ বলার কমপ্লিট গাইড ও প্র্যাকটিস মেটেরিয়ালস", regularPrice: "৳৫,০০০", offerPrice: "৳৩০০", highlight: false, order: 2 },
  { courseId: "3", icon: "fa-envelope", iconColor: "text-amber-500", bgColor: "bg-amber-50", title: "Email Marketing Blueprint", desc: "ক্লায়েন্ট হান্টিং ও লিড জেনারেশনের এডভান্সড ইমেইল মার্কেটিং স্ট্রাটেজি", regularPrice: "৳১,৫০০", offerPrice: "৳১০০", highlight: false, order: 3 },
  { courseId: "4", icon: "fa-video", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", title: "Video Editing Course by (Rafayat Rakib)", desc: "প্রিমিয়ার প্রো, আফটার ইফেক্টস দিয়ে প্রফেশনাল ভিডিও এডিটিং ও স্টোরিটেলিং", regularPrice: "৳৫০,০০০", offerPrice: "৳৬০০", highlight: true, order: 4 },
  { courseId: "5", icon: "fa-scissors", iconColor: "text-blue-500", bgColor: "bg-blue-50", title: "Capcut Video Editing Course", desc: "মোবাইল দিয়েই প্রফেশনাল শর্টস, রিলস ও টিকটক ভিডিও এডিটিং শিখুন", regularPrice: "৳১০,০০০", offerPrice: "৳৪৫০", highlight: false, order: 5 },
  { courseId: "6", icon: "fa-shield-halved", iconColor: "text-red-500", bgColor: "bg-red-50", title: "Ethical Hacking & Facebook Securing", desc: "ডিজেবল হওয়া ফেসবুক আইডি ও পেজ রিকভারি, সিকিউরিটি টেকনিকস", regularPrice: "৳১,০০০", offerPrice: "৳২০০", highlight: false, order: 6 },
  { courseId: "7", icon: "fa-chart-line", iconColor: "text-violet-500", bgColor: "bg-violet-50", title: "Digital Marketing, Affiliate & CPA Marketing", desc: "ফেসবুক এডস, গুগল এডস, অ্যাফিলিয়েট ও CPA মার্কেটিং-এর কমপ্লিট গাইড", regularPrice: "৳১৩,০০০", offerPrice: "৳৫০০", highlight: false, order: 7 },
  { courseId: "8", icon: "fa-globe", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", title: "খালিদ ফারহানের SEO কোর্স", desc: "গুগলের প্রথম পেজে র‍্যাংক করার অ্যাডভান্সড SEO টেকনিকস ও স্ট্রাটেজি", regularPrice: "৳২৫,০০০", offerPrice: "৳৩৫০", highlight: false, order: 8 },
  { courseId: "9", icon: "fa-clapperboard", iconColor: "text-pink-500", bgColor: "bg-pink-50", title: "Video Content Reels Bundle", desc: "500+ Monkey Vlogging ও 23k+ রেডিমেড কন্টেন্ট বান্ডেল ফ্রি", regularPrice: "৳৫,০০০", offerPrice: "৳২৫০", highlight: false, order: 9 },
  { courseId: "10", icon: "fa-tools", iconColor: "text-amber-600", bgColor: "bg-amber-50", title: "Tools & Resources Premium Box", desc: "Capcut Pro, Surfshark VPN, Gemini Premium, Inshot Pro, Super VPN, App Clone ও আরও অনেক কিছু", regularPrice: "৳২,৫০০", offerPrice: "৳২০০", highlight: false, order: 10 },
]

const DEFAULT_FAQS = [
  {
    faqId: "1",
    question: "কোর্সগুলো কি লাইভ হবে নাকি প্রি-রেকর্ডেড?",
    answer: "কোর্সগুলো সম্পূর্ণ প্রি-রেকর্ডেড প্রিমিয়াম ভিডিও মডিউল যা ড্রাইভে আপলোড করা আছে। ফলে আপনি আপনার সুবিধাজনক যেকোনো সময়ে ঘরে বসেই শিখতে পারবেন।",
    order: 1,
  },
  {
    faqId: "2",
    question: "ক্যানভা প্রিমিয়াম প্রজেক্ট লিংক কিভাবে এক্টিভ করবো?",
    answer: "অর্ডার সফল হওয়ার পরপরই ইমেইলে ড্রাইভ অ্যাক্সেস লিংকের সাথে একটি বিশেষ \"Canva Team Activation Link\" পাঠানো হবে। লিংকে ক্লিক করলেই আপনার সাধারণ ক্যানভা অ্যাকাউন্ট অটোমেটিক্যালি প্রিমিয়াম হয়ে যাবে।",
    order: 2,
  },
  {
    faqId: "3",
    question: "ড্রাইভ লিংকের মেয়াদ কতদিন থাকবে?",
    answer: "আপনার ড্রাইভ লিংকের অ্যাক্সেস থাকবে একদম লাইফটাইমের জন্য। কোনো রিনিউয়াল বা অতিরিক্ত চার্জ ছাড়াই আপনি আজীবন ফাইলগুলো ব্যবহার করতে পারবেন।",
    order: 3,
  },
]

export async function POST() {
  try {
    await connectDB()

    // Clear old data
    await CourseModel.deleteMany({})
    await SettingsModel.deleteMany({})
    await FaqModel.deleteMany({})

    // Insert real courses
    await CourseModel.insertMany(REAL_COURSES)

    // Insert default FAQs
    await FaqModel.insertMany(DEFAULT_FAQS)

    // Insert default settings
    await SettingsModel.create({
      key: "main",
      bundlePrice: "৳৬৫০",
      bundleRegularPrice: "৳১,২০,০০০+",
      countdownMinutes: 10,
      countdownSeconds: 0,
      toolsAndResources: "Capcut Pro, Surfshark VPN, Gemini Premium, Gork-v0.5.24-Mod, Inshot Pro, Super VPN, App Clone, 3 Best Theme, 15k GPT Prompts, Canva Premium (ফ্রি)",
      offerEndMessage: "অফারটির মেয়াদ শেষ হয়ে গেছে!",
      videoUrl: "",
      videoTitle: "কিভাবে এই সিঙ্গেল বান্ডেল আপনার লাইফ পরিবর্তন করতে পারে?",
      videoThumbnail: "",
      whatsappNumber: "",
      telegramLink: "",
    })

    return NextResponse.json({ success: true, message: "Database seeded with real data, including courses, settings, and FAQs!" })
  } catch (err) {
    console.error("Seed error:", err)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
