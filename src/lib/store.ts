import mongoose from "mongoose"

export interface Course {
  id?: string
  courseId?: string
  icon: string
  iconColor: string
  bgColor: string
  title: string
  desc: string
  regularPrice: string
  offerPrice: string
  highlight: boolean
  order?: number
}

export interface AppSettings {
  bundlePrice: string
  bundleRegularPrice: string
  countdownMinutes: number
  countdownSeconds: number
  toolsAndResources: string
  offerEndMessage: string
  videoUrl: string
  videoTitle: string
  videoThumbnail: string
  whatsappNumber: string
  telegramLink: string
  topRibbonText: string
}

export interface Faq {
  id?: string
  faqId?: string
  question: string
  answer: string
  order: number
}

const ADMIN_PASSWORD = "SkillsHQ@2026#Secure"
const STORAGE_KEY_AUTH = "skillshq_admin_auth"

// ----- API Helpers -----
async function apiCall(path: string, options?: RequestInit) {
  try {
    const res = await fetch(path, options)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(`API call failed [${path}]:`, err)
    throw err
  }
}

// ----- Courses (via API) -----
export async function fetchCourses(): Promise<Course[]> {
  try {
    const data = await apiCall("/api/courses")
    // Strip MongoDB internal fields from each course
    return data.map((c: any) => {
      const { _id, __v, createdAt, updatedAt, ...clean } = c
      return clean as Course
    })
  } catch {
    return getCoursesFallback()
  }
}

export async function createCourse(course: Course): Promise<Course> {
  return await apiCall("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  })
}

export async function updateCourse(courseId: string, course: Partial<Course>): Promise<Course> {
  return await apiCall(`/api/courses/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  })
}

export async function deleteCourse(courseId: string): Promise<void> {
  await apiCall(`/api/courses/${courseId}`, { method: "DELETE" })
}

// ----- Settings (via API) -----
export async function fetchSettings(): Promise<AppSettings> {
  try {
    const data = await apiCall("/api/settings")
    // Strip MongoDB internal fields
    const { _id, __v, createdAt, updatedAt, key, ...clean } = data
    return clean as AppSettings
  } catch {
    return getSettingsFallback()
  }
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  return await apiCall("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  })
}

// ----- FAQs (via API) -----
export async function fetchFaqs(): Promise<Faq[]> {
  try {
    const data = await apiCall("/api/faqs")
    // Strip MongoDB internal fields from each FAQ
    return data.map((f: any) => {
      const { _id, __v, createdAt, updatedAt, ...clean } = f
      return { ...clean, id: clean.faqId } as Faq
    })
  } catch {
    return getFaqsFallback()
  }
}

export async function createFaq(faq: Faq): Promise<Faq> {
  return await apiCall("/api/faqs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  })
}

export async function updateFaq(faqId: string, faq: Partial<Faq>): Promise<Faq> {
  return await apiCall(`/api/faqs/${faqId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  })
}

export async function deleteFaq(faqId: string): Promise<void> {
  await apiCall(`/api/faqs/${faqId}`, { method: "DELETE" })
}

// ----- LocalStorage Fallbacks (for public-facing SSR-safe reads) -----
const STORAGE_KEY_COURSES = "skillshq_courses"
const STORAGE_KEY_SETTINGS = "skillshq_settings"
const STORAGE_KEY_FAQS = "skillshq_faqs"

function getCoursesFallback(): Course[] {
  if (typeof window === "undefined") return DEFAULT_COURSES
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COURSES)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_COURSES
}

function getSettingsFallback(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_SETTINGS
}

function getFaqsFallback(): Faq[] {
  if (typeof window === "undefined") return DEFAULT_FAQS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAQS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_FAQS
}

export function getCourses(): Course[] {
  return getCoursesFallback()
}

export function saveCourses(courses: Course[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses))
}

export function getSettings(): AppSettings {
  return getSettingsFallback()
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
}

export function getFaqs(): Faq[] {
  return getFaqsFallback()
}

export function saveFaqs(faqs: Faq[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(faqs))
}

// ----- Auth -----
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY_AUTH) === "true"
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEY_AUTH, "true")
    return true
  }
  return false
}

export function adminLogout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY_AUTH)
}

// ----- Helpers -----
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export const FA_ICONS = [
  { value: "fa-robot", label: "🤖 Robot", color: "text-amber-500", bg: "bg-amber-50" },
  { value: "fa-volume-high", label: "🔊 Volume", color: "text-sky-500", bg: "bg-sky-50" },
  { value: "fa-envelope", label: "✉️ Email", color: "text-amber-500", bg: "bg-amber-50" },
  { value: "fa-video", label: "🎬 Video", color: "text-yellow-600", bg: "bg-yellow-50" },
  { value: "fa-scissors", label: "✂️ Edit", color: "text-blue-500", bg: "bg-blue-50" },
  { value: "fa-shield-halved", label: "🛡️ Security", color: "text-red-500", bg: "bg-red-50" },
  { value: "fa-chart-line", label: "📈 Chart", color: "text-violet-500", bg: "bg-violet-50" },
  { value: "fa-globe", label: "🌐 Globe", color: "text-yellow-600", bg: "bg-yellow-50" },
  { value: "fa-clapperboard", label: "🎞️ Clapper", color: "text-pink-500", bg: "bg-pink-50" },
  { value: "fa-tools", label: "🔧 Tools", color: "text-amber-600", bg: "bg-amber-50" },
  { value: "fa-graduation-cap", label: "🎓 Grad", color: "text-amber-500", bg: "bg-amber-50" },
  { value: "fa-code", label: "💻 Code", color: "text-indigo-500", bg: "bg-indigo-50" },
  { value: "fa-paint-brush", label: "🎨 Paint", color: "text-purple-500", bg: "bg-purple-50" },
  { value: "fa-mobile-screen", label: "📱 Mobile", color: "text-green-500", bg: "bg-green-50" },
  { value: "fa-camera", label: "📷 Camera", color: "text-rose-500", bg: "bg-rose-50" },
  { value: "fa-music", label: "🎵 Music", color: "text-orange-500", bg: "bg-orange-50" },
  { value: "fa-heart", label: "❤️ Heart", color: "text-red-500", bg: "bg-red-50" },
  { value: "fa-star", label: "⭐ Star", color: "text-yellow-500", bg: "bg-yellow-50" },
]

// ----- Default Data -----
export const DEFAULT_COURSES: Course[] = [
  { id: "1", icon: "fa-robot", iconColor: "text-amber-500", bgColor: "bg-amber-50", title: "AI কনটেন্ট ক্রিয়েশন ওয়ার্কশপ ফুল কোর্স", desc: "এআই টুল দিয়ে প্রফেশনাল কনটেন্ট রাইটিং, ইমেজ ও ভিডিও ক্রিয়েশন শিখুন", regularPrice: "৳৮,০০০", offerPrice: "৳৪০০", highlight: false },
  { id: "2", icon: "fa-volume-high", iconColor: "text-sky-500", bgColor: "bg-sky-50", title: "IELTS (Spoken English) Course", desc: "ঘরে বসে ফ্লুয়েন্টলি ইংলিশ বলার কমপ্লিট গাইড ও প্র্যাকটিস মেটেরিয়ালস", regularPrice: "৳৫,০০০", offerPrice: "৳৩০০", highlight: false },
  { id: "3", icon: "fa-envelope", iconColor: "text-amber-500", bgColor: "bg-amber-50", title: "Email Marketing Blueprint", desc: "ক্লায়েন্ট হান্টিং ও লিড জেনারেশনের এডভান্সড ইমেইল মার্কেটিং স্ট্রাটেজি", regularPrice: "৳১,৫০০", offerPrice: "৳১০০", highlight: false },
  { id: "4", icon: "fa-video", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", title: "Video Editing Course by (Rafayat Rakib)", desc: "প্রিমিয়ার প্রো, আফটার ইফেক্টস দিয়ে প্রফেশনাল ভিডিও এডিটিং ও স্টোরিটেলিং", regularPrice: "৳৫০,০০০", offerPrice: "৳৬০০", highlight: true },
  { id: "5", icon: "fa-scissors", iconColor: "text-blue-500", bgColor: "bg-blue-50", title: "Capcut Video Editing Course", desc: "মোবাইল দিয়েই প্রফেশনাল শর্টস, রিলস ও টিকটক ভিডিও এডিটিং শিখুন", regularPrice: "৳১০,০০০", offerPrice: "৳৪৫০", highlight: false },
  { id: "6", icon: "fa-shield-halved", iconColor: "text-red-500", bgColor: "bg-red-50", title: "Ethical Hacking & Facebook Securing", desc: "ডিজেবল হওয়া ফেসবুক আইডি ও পেজ রিকভারি, সিকিউরিটি টেকনিকস", regularPrice: "৳১,০০০", offerPrice: "৳২০০", highlight: false },
  { id: "7", icon: "fa-chart-line", iconColor: "text-violet-500", bgColor: "bg-violet-50", title: "Digital Marketing, Affiliate & CPA Marketing", desc: "ফেসবুক এডস, গুগল এডস, অ্যাফিলিয়েট ও CPA মার্কেটিং-এর কমপ্লিট গাইড", regularPrice: "৳১৩,০০০", offerPrice: "৳৫০০", highlight: false },
  { id: "8", icon: "fa-globe", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", title: "খালিদ ফারহানের SEO কোর্স", desc: "গুগলের প্রথম পেজে র‍্যাংক করার অ্যাডভান্সড SEO টেকনিকস ও স্ট্রাটেজি", regularPrice: "৳২৫,০০০", offerPrice: "৳৩৫০", highlight: false },
  { id: "9", icon: "fa-clapperboard", iconColor: "text-pink-500", bgColor: "bg-pink-50", title: "Video Content Reels Bundle", desc: "500+ Monkey Vlogging ও 23k+ রেডিমেড কন্টেন্ট বান্ডেল ফ্রি", regularPrice: "৳৫,০০০", offerPrice: "৳২৫০", highlight: false },
  { id: "10", icon: "fa-tools", iconColor: "text-amber-600", bgColor: "bg-amber-50", title: "Tools & Resources Premium Box", desc: "Capcut Pro, Surfshark VPN, Gemini Premium, Inshot Pro, Super VPN, App Clone ও আরও অনেক কিছু", regularPrice: "৳২,৫০০", offerPrice: "৳২০০", highlight: false },
]

export const DEFAULT_FAQS: Faq[] = [
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

const DEFAULT_SETTINGS: AppSettings = {
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
  topRibbonText: "বিশেষ মেগা অফার: আজ রাত ১২টা পর্যন্ত সব কোর্স এবং Canva Premium একদম ফ্রি!",
}
