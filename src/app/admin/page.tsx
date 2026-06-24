"use client"

import { useState, useEffect } from "react"
import {
  Course,
  AppSettings,
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchSettings,
  updateSettings,
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  generateId,
  FA_ICONS,
  saveCourses,
  saveSettings,
} from "@/lib/store"
import { showToast, showSuccess, showError, showConfirm } from "@/lib/notify"
import Swal from "sweetalert2"

type NavItem =
  | "courses"
  | "add-course"
  | "registrations"
  | "video"
  | "contact"
  | "price"
  | "timer"
  | "tools"
  | "message"

const NAV_ITEMS: { id: NavItem; icon: string; label: string; section: string }[] = [
  { id: "courses", icon: "fa-list", label: "সব কোর্স", section: "কোর্স ম্যানেজমেন্ট" },
  { id: "add-course", icon: "fa-plus-circle", label: "নতুন কোর্স যোগ", section: "কোর্স ম্যানেজমেন্ট" },
  { id: "registrations", icon: "fa-users", label: "রেজিস্ট্রেশন লিস্ট", section: "অর্ডার ম্যানেজমেন্ট" },
  { id: "video", icon: "fa-circle-play", label: "ভিডিও সেটিংস", section: "কন্টেন্ট ম্যানেজমেন্ট" },
  { id: "contact", icon: "fa-phone", label: "কন্টাক্ট সেটিংস", section: "কন্টেন্ট ম্যানেজমেন্ট" },
  { id: "price", icon: "fa-tag", label: "বান্ডেল প্রাইস", section: "অফার সেটিংস" },
  { id: "timer", icon: "fa-clock", label: "কাউন্টডাউন টাইমার", section: "অফার সেটিংস" },
  { id: "tools", icon: "fa-toolbox", label: "টুলস ও রিসোর্স", section: "অফার সেটিংস" },
  { id: "message", icon: "fa-message", label: "অফার মেসেজ", section: "অফার সেটিংস" },
]

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [courses, setCourses] = useState<Course[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [activeNav, setActiveNav] = useState<NavItem>("courses")
  const [loading, setLoading] = useState(false)

  // Edit state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)

  // New course form state (for add-course tab)
  const defaultIcon = FA_ICONS[0]
  const [newCourse, setNewCourse] = useState<Course>({
    icon: defaultIcon.value,
    iconColor: defaultIcon.color,
    bgColor: defaultIcon.bg,
    title: "",
    desc: "",
    regularPrice: "৳",
    offerPrice: "৳",
    highlight: false,
  })

  useEffect(() => {
    const authed = isAdminLoggedIn()
    setLoggedIn(authed)
    setAuthChecking(false)
    const saved = localStorage.getItem("skillshq_activeNav")
    if (saved && NAV_ITEMS.some(n => n.id === saved)) setActiveNav(saved as NavItem)
    if (authed) loadData()
  }, [])

  // Save active page on change
  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav)
    localStorage.setItem("skillshq_activeNav", nav)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [c, s, r] = await Promise.all([
        fetchCourses(),
        fetchSettings(),
        fetch("/api/registrations").then(res => res.ok ? res.json() : []),
      ])
      const processed = c.map((x: Course) => ({ ...x, id: x.courseId || x.id }))
      setCourses(processed)
      setSettings(s)
      setRegistrations(Array.isArray(r) ? r : [])
      // Sync to localStorage as cache for landing page fallback
      saveCourses(processed)
      saveSettings(s)
    } catch { /* fallback */ }
    finally { setLoading(false) }
  }

  const handleLogin = () => {
    if (adminLogin(password)) {
      setLoggedIn(true)
      setLoginError("")
      showToast("স্বাগতম! সফলভাবে লগইন হয়েছে", "success")
      loadData()
    } else {
      setLoginError("ভুল পাসওয়ার্ড!")
    }
  }

  const handleLogout = () => { adminLogout(); setLoggedIn(false) }

  // ---- Course CRUD ----
  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course })
    setEditingId(course.courseId || course.id || null)
    setActiveNav("add-course")
  }

  const handleSaveCourseForm = async () => {
    const target = editingId ? editingCourse : newCourse
    if (!target || !target.title) return showToast("কোর্সের নাম প্রয়োজন!", "warning")
    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateCourse(editingId, target!)
        setCourses(prev => {
          const next = prev.map(c => (c.courseId || c.id) === editingId ? { ...updated, id: updated.courseId || updated.id } : c)
          saveCourses(next)
          return next
        })
      } else {
        const created = await createCourse({ ...newCourse, courseId: generateId() })
        setCourses(prev => {
          const next = [...prev, { ...created, id: created.courseId || created.id }]
          saveCourses(next)
          return next
        })
        setNewCourse({ icon: defaultIcon.value, iconColor: defaultIcon.color, bgColor: defaultIcon.bg, title: "", desc: "", regularPrice: "৳", offerPrice: "৳", highlight: false })
      }
      setEditingCourse(null)
      setEditingId(null)
      setActiveNav("courses")
    } catch { showToast("সেভ করতে সমস্যা হয়েছে!", "error") }
    finally { setSaving(false) }
  }

  const handleDeleteCourse = async (id: string) => {
    const ok = await showConfirm("আপনি কি নিশ্চিত এই কোর্সটি ডিলিট করতে চান?")
    if (!ok) return
    try {
      await deleteCourse(id)
      setCourses(prev => {
        const next = prev.filter(c => (c.courseId || c.id) !== id)
        saveCourses(next)
        return next
      })
    } catch { showToast('ডিলিট করতে সমস্যা হয়েছে!', 'error') }
  }

  // ---- LOGIN SCREEN ----
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-amber-500"></i>
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <i className="fa-solid fa-lock text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-black text-slate-900">SKILLSHQ <span className="text-amber-500">Admin</span></h1>
            <p className="text-xs text-slate-500">অ্যাডমিন প্যানেলে লগইন করুন</p>
          </div>
          <div className="space-y-3">
            <input type="password" placeholder="পাসওয়ার্ড টাইপ করুন..." value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full border border-slate-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition" autoFocus />
            {loginError && <p className="text-red-500 text-xs font-medium flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {loginError}</p>}
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 rounded-lg transition shadow-lg">
              <i className="fa-solid fa-right-to-bracket mr-2"></i> লগইন
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">নিরাপদ অ্যাডমিন অ্যাক্সেস</p>
        </div>
      </div>
    )
  }

  // ---- RENDER CONTENT ----
  const renderContent = () => {
    switch (activeNav) {
      case "courses": return <CoursesList />
      case "add-course": return <CourseForm />
      case "registrations": return <RegistrationsList />
      case "video": return <VideoSettings />
      case "contact": return <ContactSettings />
      case "price": return <PriceSettings />
      case "timer": return <TimerSettings />
      case "tools": return <ToolsSettings />
      case "message": return <MessageSettings />
      default: return <CoursesList />
    }
  }

  // ============= CONTENT COMPONENTS =============

  function CoursesList() {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">সব কোর্স</h2>
            <p className="text-xs text-slate-500 mt-0.5">সর্বমোট <span className="font-bold text-slate-700">{courses.length}</span> টি কোর্স</p>
          </div>
          <button onClick={() => { setEditingCourse(null); setEditingId(null); setActiveNav("add-course") }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition shadow flex items-center gap-1.5">
            <i className="fa-solid fa-plus"></i> নতুন কোর্স যোগ
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-5 w-12">#</th>
                <th className="py-3 px-5">কোর্সের নাম</th>
                <th className="py-3 px-5 w-28">রেগুলার</th>
                <th className="py-3 px-5 w-28">অফার</th>
                <th className="py-3 px-5 w-14 text-center">⭐</th>
                <th className="py-3 px-5 w-20 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course, i) => (
                <tr key={course.courseId || course.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg ${course.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <i className={`fa-solid ${course.icon} ${course.iconColor} text-sm`}></i>
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block text-sm leading-snug">{course.title || "(নাম নেই)"}</span>
                        <span className="text-[10px] text-slate-400">{course.desc?.slice(0, 55)}{(course.desc?.length || 0) > 55 ? "..." : ""}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-slate-400 line-through text-xs">{course.regularPrice}</td>
                  <td className="py-3 px-5 text-emerald-600 font-bold text-xs">{course.offerPrice}</td>
                  <td className="py-3 px-5 text-center">{course.highlight ? <span className="text-amber-500">⭐</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEditCourse(course)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition text-xs" title="এডিট"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => handleDeleteCourse(course.courseId || course.id || "")} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition text-xs" title="ডিলিট"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">কোনো কোর্স পাওয়া যায়নি</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {courses.map((course, i) => (
            <div key={course.courseId || course.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className={`w-9 h-9 rounded-lg ${course.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <i className={`fa-solid ${course.icon} ${course.iconColor}`}></i>
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm">{course.title || "(নাম নেই)"}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{course.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 line-through">{course.regularPrice}</span>
                    <span className="text-sm font-bold text-emerald-600">{course.offerPrice}</span>
                    {course.highlight && <span className="text-amber-500 text-xs">⭐ ফিচার্ড</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEditCourse(course)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><i className="fa-solid fa-pen-to-square text-xs"></i></button>
                  <button onClick={() => handleDeleteCourse(course.courseId || course.id || "")} className="p-1.5 hover:bg-red-50 rounded text-red-500"><i className="fa-solid fa-trash text-xs"></i></button>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-center text-slate-400 text-sm py-8">কোনো কোর্স পাওয়া যায়নি</p>}
        </div>
      </div>
    )
  }

  // ---- Registrations List ----
  function RegistrationsList() {
    const totalReg = registrations.length
    const completedReg = registrations.filter((r: any) => r.status === "completed").length
    const pendingReg = registrations.filter((r: any) => r.status === "pending").length
    const totalAmount = registrations.reduce((sum: number, r: any) => sum + (r.status === "completed" ? 650 : 0), 0)

    // State for managing private links
    const [expandedReg, setExpandedReg] = useState<string | null>(null)
    const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
    const [telegramInput, setTelegramInput] = useState<string>("")
    const [savingLinks, setSavingLinks] = useState(false)
    // Track which course we're adding a link for
    const [addingLinkFor, setAddingLinkFor] = useState<{ courseTitle: string; link: string }>({ courseTitle: "", link: "" })

    const toggleExpand = (regId: string) => {
      if (expandedReg === regId) {
        setExpandedReg(null)
        setAddingLinkFor({ courseTitle: "", link: "" })
      } else {
        setExpandedReg(regId)
        const reg = registrations.find((r: any) => r._id === regId)
        if (reg) {
          // Pre-fill telegram link
          setTelegramInput(reg.telegramLink || "")
          // Build linkInputs from existing privateLinks
          const inputs: Record<string, string> = {}
          if (reg.privateLinks) {
            reg.privateLinks.forEach((pl: any) => {
              inputs[pl.courseTitle] = pl.link
            })
          }
          setLinkInputs(inputs)
          setAddingLinkFor({ courseTitle: "", link: "" })
        }
      }
    }

    const updateStatus = async (id: string, status: string) => {
      try {
        await fetch(`/api/registrations/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
        setRegistrations((prev: any[]) =>
          prev.map((r: any) => (r._id === id ? { ...r, status } : r))
        )
        // Auto-expand when setting to completed
        if (status === "completed") {
          setExpandedReg(id)
          const reg = registrations.find((r: any) => r._id === id)
          if (reg) {
            setTelegramInput(reg.telegramLink || "")
          }
        }
      } catch { showToast("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!", "error") }
    }

    const deleteReg = async (id: string) => {
      const ok2 = await showConfirm("আপনি কি নিশ্চিত এই রেজিস্ট্রেশন ডিলিট করতে চান?")
      if (!ok2) return
      try {
        await fetch(`/api/registrations/${id}`, { method: "DELETE" })
        setRegistrations((prev: any[]) => prev.filter((r: any) => r._id !== id))
      } catch { showToast('ডিলিট করতে সমস্যা হয়েছে!', 'error') }
    }

    // View payment screenshot in a modal
    const viewScreenshot = (src: string) => {
      Swal.fire({
        title: "পেমেন্ট স্ক্রিনশট",
        imageUrl: src,
        imageAlt: "Payment Screenshot",
        imageWidth: 400,
        imageHeight: "auto",
        showCloseButton: true,
        showConfirmButton: false,
        width: 460,
        customClass: {
          popup: "!rounded-2xl !shadow-2xl !bg-slate-900",
          title: "!text-white !text-sm !font-bold",
          image: "!rounded-xl !max-h-[60vh] !object-contain",
        },
      })
    }

    // Add a private link for a course
    const addPrivateLink = async (regId: string) => {
      if (!addingLinkFor.courseTitle.trim() || !addingLinkFor.link.trim()) {
        showToast("কোর্সের নাম ও লিংক দিন", "warning")
        return
      }
      setSavingLinks(true)
      try {
        const reg = registrations.find((r: any) => r._id === regId)
        const existingLinks = reg?.privateLinks || []
        const updatedLinks = [
          ...existingLinks.filter((pl: any) => pl.courseTitle !== addingLinkFor.courseTitle.trim()),
          { courseTitle: addingLinkFor.courseTitle.trim(), link: addingLinkFor.link.trim() }
        ]

        const res = await fetch(`/api/registrations/${regId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ privateLinks: updatedLinks }),
        })

        if (res.ok) {
          const updated = await res.json()
          setRegistrations((prev: any[]) =>
            prev.map((r: any) => (r._id === regId ? updated : r))
          )
          setLinkInputs((prev) => ({ ...prev, [addingLinkFor.courseTitle.trim()]: addingLinkFor.link.trim() }))
          setAddingLinkFor({ courseTitle: "", link: "" })
          showToast("লিংক সফলভাবে যোগ হয়েছে!", "success")
        }
      } catch {
        showToast("লিংক যোগ করতে সমস্যা হয়েছে!", "error")
      } finally {
        setSavingLinks(false)
      }
    }

    // Remove a private link
    const removePrivateLink = async (regId: string, courseTitle: string) => {
      const ok = await showConfirm(`"${courseTitle}" কোর্সের লিংক রিমুভ করবেন?`)
      if (!ok) return
      setSavingLinks(true)
      try {
        const reg = registrations.find((r: any) => r._id === regId)
        const updatedLinks = (reg?.privateLinks || []).filter((pl: any) => pl.courseTitle !== courseTitle)

        const res = await fetch(`/api/registrations/${regId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ privateLinks: updatedLinks }),
        })

        if (res.ok) {
          const updated = await res.json()
          setRegistrations((prev: any[]) =>
            prev.map((r: any) => (r._id === regId ? updated : r))
          )
          setLinkInputs((prev) => {
            const next = { ...prev }
            delete next[courseTitle]
            return next
          })
          showToast("লিংক রিমুভ হয়েছে", "success")
        }
      } catch {
        showToast("রিমুভ করতে সমস্যা হয়েছে!", "error")
      } finally {
        setSavingLinks(false)
      }
    }

    // Save telegram link
    const saveTelegramLink = async (regId: string) => {
      setSavingLinks(true)
      try {
        const res = await fetch(`/api/registrations/${regId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramLink: telegramInput.trim() }),
        })

        if (res.ok) {
          const updated = await res.json()
          setRegistrations((prev: any[]) =>
            prev.map((r: any) => (r._id === regId ? updated : r))
          )
          showToast("টেলিগ্রাম লিংক সেভ হয়েছে!", "success")
        }
      } catch {
        showToast("সেভ করতে সমস্যা হয়েছে!", "error")
      } finally {
        setSavingLinks(false)
      }
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">রেজিস্ট্রেশন লিস্ট</h2>
            <p className="text-xs text-slate-500 mt-0.5">সর্বমোট <span className="font-bold text-slate-700">{totalReg}</span> জন রেজিস্ট্রেশন করেছেন</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <span className="block text-2xl font-black text-slate-800">{totalReg}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">মোট রেজিস্ট্রেশন</span>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm text-center">
            <span className="block text-2xl font-black text-emerald-600">{completedReg}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">কমপ্লিটেড</span>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm text-center">
            <span className="block text-2xl font-black text-amber-600">{pendingReg}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">পেন্ডিং</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <span className="block text-2xl font-black text-emerald-600">৳{totalAmount.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">মোট আয়</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">ফোন</th>
                <th className="py-3 px-4">ইমেইল</th>
                <th className="py-3 px-4 w-24">পেমেন্ট</th>
                <th className="py-3 px-4 w-28">ট্রান. আইডি</th>
                <th className="py-3 px-4 w-16">প্রুফ</th>
                <th className="py-3 px-4 w-24 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4 w-28 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.map((reg: any, i: number) => (
                <>
                <tr key={reg._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 text-slate-400 text-xs">{totalReg - i}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 text-sm">{reg.name}</td>
                  <td className="py-3 px-4 text-xs text-slate-600 font-mono">{reg.phone}</td>
                  <td className="py-3 px-4 text-xs text-slate-500">{reg.email}</td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-700 uppercase">{reg.paymentMethod}</td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-600">
                    {reg.transactionId ? (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{reg.transactionId}</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {reg.screenshot ? (
                      <button onClick={() => viewScreenshot(reg.screenshot)} className="text-amber-600 hover:text-amber-800 transition" title="স্ক্রিনশট দেখুন">
                        <img src={reg.screenshot} alt="payment proof" className="w-8 h-8 rounded object-cover border border-slate-200" />
                      </button>
                    ) : (
                      <span className="text-slate-300"><i className="fa-solid fa-image-slash text-sm"></i></span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={reg.status}
                      onChange={(e) => updateStatus(reg._id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${
                        reg.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : reg.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <option value="pending">⏳ পেন্ডিং</option>
                      <option value="completed">✅ কমপ্লিট</option>
                      <option value="cancelled">❌ ক্যান্সেল</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleExpand(reg._id)}
                        className={`p-1.5 rounded transition text-xs ${expandedReg === reg._id ? "bg-violet-100 text-violet-600" : "hover:bg-violet-50 text-violet-500"}`}
                        title="লিংক ম্যানেজ করুন"
                      >
                        <i className="fa-solid fa-link"></i>
                      </button>
                      <button onClick={() => deleteReg(reg._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition text-xs" title="ডিলিট">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded: Private Links Management */}
                {expandedReg === reg._id && (
                  <tr key={`${reg._id}-links`}>
                    <td colSpan={9} className="bg-violet-50/30 p-6 border-t border-violet-100">
                      <div className="max-w-3xl space-y-5">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                          <i className="fa-solid fa-link text-violet-500"></i>
                          {reg.name} - এর জন্য প্রাইভেট লিংক ম্যানেজ করুন
                        </h3>

                        {/* Telegram Link */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <i className="fa-brands fa-telegram text-sky-500"></i>
                            <span className="text-xs font-bold text-slate-700">টেলিগ্রাম গ্রুপ লিংক</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={telegramInput}
                              onChange={(e) => setTelegramInput(e.target.value)}
                              placeholder="https://t.me/+xxxxxx"
                              className="flex-1 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <button
                              onClick={() => saveTelegramLink(reg._id)}
                              disabled={savingLinks}
                              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1"
                            >
                              <i className="fa-solid fa-check"></i> সেভ
                            </button>
                          </div>
                        </div>

                        {/* Existing Private Links */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600">
                            <i className="fa-solid fa-folder-tree mr-1 text-violet-500"></i>
                            কোর্স লিংকসমূহ ({reg.privateLinks?.length || 0})
                          </h4>
                          {reg.privateLinks && reg.privateLinks.length > 0 ? (
                            <div className="grid gap-2">
                              {reg.privateLinks.map((pl: any, plIdx: number) => (
                                <div key={plIdx} className={"bg-white rounded-lg border p-3 flex items-center justify-between gap-3 " + (pl.clicked ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200")}>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">
                                      {pl.courseTitle}
                                      {pl.clicked ? <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-normal">✅ দেখা হয়েছে</span> : <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-normal">⏳ দেখা হয়নি</span>}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate font-mono">{pl.link}</p>
                                    {pl.clickedAt && <p className="text-[9px] text-slate-400 mt-0.5">{new Date(pl.clickedAt).toLocaleString("bn-BD")}</p>}
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {pl.clicked ? (
                                      <span className="text-[10px] text-emerald-600 font-bold px-2">✅</span>
                                    ) : (
                                      <button
                                        onClick={() => window.open(pl.link, "_blank")}
                                        className="p-1.5 hover:bg-violet-100 rounded text-violet-600 text-xs"
                                        title="ওপেন"
                                      >
                                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => removePrivateLink(reg._id, pl.courseTitle)}
                                      className="p-1.5 hover:bg-red-50 rounded text-red-500 text-xs"
                                      title="রিমুভ"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 text-center py-3">এখনো কোনো কোর্স লিংক যোগ করা হয়নি</p>
                          )}
                        </div>

                        {/* Add New Private Link */}
                        <div className="bg-white rounded-xl border border-violet-200 p-4 space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <i className="fa-solid fa-plus-circle text-violet-500"></i> নতুন কোর্স লিংক যোগ করুন
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={addingLinkFor.courseTitle}
                              onChange={(e) => setAddingLinkFor({ ...addingLinkFor, courseTitle: e.target.value })}
                              placeholder="কোর্সের নাম (যেমন: AI Course)"
                              className="border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <input
                              type="text"
                              value={addingLinkFor.link}
                              onChange={(e) => setAddingLinkFor({ ...addingLinkFor, link: e.target.value })}
                              placeholder="লিংক (Google Drive / Dropbox)"
                              className="border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>
                          <button
                            onClick={() => addPrivateLink(reg._id)}
                            disabled={savingLinks}
                            className="bg-violet-500 hover:bg-violet-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {savingLinks ? <><i className="fa-solid fa-spinner animate-spin"></i> সেভ হচ্ছে...</> : <><i className="fa-solid fa-plus"></i> লিংক যোগ করুন</>}
                          </button>
                        </div>

                        {/* Close button */}
                        <button
                          onClick={() => setExpandedReg(null)}
                          className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
                        >
                          <i className="fa-solid fa-chevron-up"></i> ক্লোজ করুন
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                </>
              ))}
              {registrations.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400 text-sm">এখনো কেউ রেজিস্ট্রেশন করেনি</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {registrations.map((reg: any, i: number) => (
            <div key={reg._id}>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm">{reg.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{reg.email} · {reg.phone}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleExpand(reg._id)}
                      className={`p-1.5 rounded transition ${expandedReg === reg._id ? "bg-violet-100 text-violet-600" : "hover:bg-violet-50 text-violet-500"}`}>
                      <i className="fa-solid fa-link text-xs"></i>
                    </button>
                    <button onClick={() => deleteReg(reg._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500 flex-shrink-0">
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] mb-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">#{reg._id?.slice(-6).toUpperCase()}</span>
                  <span className="font-medium text-slate-600 uppercase">{reg.paymentMethod}</span>
                  {reg.transactionId && (
                    <span className="bg-amber-50 px-2 py-0.5 rounded font-mono text-amber-700 text-[10px]" title="ট্রানজেকশন আইডি">
                      <i className="fa-solid fa-receipt mr-1"></i>{reg.transactionId}
                    </span>
                  )}
                  {reg.screenshot && (
                    <button onClick={() => viewScreenshot(reg.screenshot)} className="text-amber-600 hover:text-amber-800 flex items-center gap-1" title="স্ক্রিনশট দেখুন">
                      <img src={reg.screenshot} alt="proof" className="w-6 h-6 rounded object-cover border" />
                      <span className="text-[10px]">স্ক্রিনশট</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={reg.status}
                    onChange={(e) => updateStatus(reg._id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 ${
                      reg.status === "completed" ? "bg-emerald-100 text-emerald-700" : reg.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <option value="pending">⏳ পেন্ডিং</option>
                    <option value="completed">✅ কমপ্লিট</option>
                    <option value="cancelled">❌ ক্যান্সেল</option>
                  </select>
                  <span className="text-[10px] text-slate-400">
                    {reg.privateLinks?.length || 0} লিংক
                  </span>
                </div>
              </div>

              {/* Mobile Expanded: Private Links */}
              {expandedReg === reg._id && (
                <div className="bg-violet-50/50 border border-violet-200 border-t-0 rounded-b-xl p-3 space-y-3 mt-0">
                  <h4 className="text-[11px] font-black text-slate-700">লিংক ম্যানেজমেন্ট</h4>

                  {/* Telegram */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><i className="fa-brands fa-telegram text-sky-500"></i> টেলিগ্রাম</span>
                    <div className="flex gap-1">
                      <input type="text" value={telegramInput} onChange={(e) => setTelegramInput(e.target.value)}
                        className="flex-1 border border-slate-200 rounded text-[10px] py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-violet-500" placeholder="https://t.me/..." />
                      <button onClick={() => saveTelegramLink(reg._id)} disabled={savingLinks}
                        className="bg-sky-500 text-white text-[10px] font-bold px-3 rounded transition disabled:opacity-50">সেভ</button>
                    </div>
                  </div>

                  {/* Existing links */}
                  {reg.privateLinks?.map((pl: any, plIdx: number) => (
                    <div key={plIdx} className={"bg-white rounded border p-2 flex items-center justify-between gap-1 " + (pl.clicked ? "border-emerald-300 bg-emerald-50/30" : "")}>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold truncate">{pl.courseTitle} {pl.clicked ? "✅" : "⏳"}</p>
                        <p className="text-[9px] text-slate-400 truncate font-mono">{pl.link}</p>
                      </div>
                      <button onClick={() => removePrivateLink(reg._id, pl.courseTitle)} className="text-red-500 text-[10px] p-1"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ))}

                  {/* Add new */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500">+ নতুন লিংক যোগ</span>
                    <input type="text" value={addingLinkFor.courseTitle}
                      onChange={(e) => setAddingLinkFor({ ...addingLinkFor, courseTitle: e.target.value })}
                      className="w-full border border-slate-200 rounded text-[10px] py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-violet-500" placeholder="কোর্সের নাম" />
                    <input type="text" value={addingLinkFor.link}
                      onChange={(e) => setAddingLinkFor({ ...addingLinkFor, link: e.target.value })}
                      className="w-full border border-slate-200 rounded text-[10px] py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-violet-500" placeholder="লিংক" />
                    <button onClick={() => addPrivateLink(reg._id)} disabled={savingLinks}
                      className="w-full bg-violet-500 text-white text-[10px] font-bold py-1.5 rounded transition disabled:opacity-50">
                      {savingLinks ? "সেভ হচ্ছে..." : "লিংক যোগ করুন"}
                    </button>
                  </div>

                  <button onClick={() => setExpandedReg(null)} className="text-[10px] text-slate-500 w-full text-center py-1">▲ ক্লোজ</button>
                </div>
              )}
            </div>
          ))}
          {registrations.length === 0 && <p className="text-center text-slate-400 text-sm py-8">এখনো কেউ রেজিস্ট্রেশন করেনি</p>}
        </div>
      </div>
    )
  }

  // ---- Course Form (Add / Edit) ----
  function CourseForm() {
    const isEdit = !!editingId
    const form = isEdit ? editingCourse! : newCourse
    const setForm = isEdit ? setEditingCourse : setNewCourse

    return (
      <div className="space-y-5 max-w-2xl">
        <div>
          <h2 className="text-xl font-black text-slate-900">{isEdit ? "কোর্স এডিট করুন" : "নতুন কোর্স যোগ করুন"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{isEdit ? "প্রয়োজনীয় তথ্য আপডেট করুন" : "নতুন কোর্সের তথ্য পূরণ করুন"}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          {/* Icon */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">আইকন সিলেক্ট করুন</label>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {FA_ICONS.map(ic => (
                <button key={ic.value} onClick={() => setForm({ ...form, icon: ic.value, iconColor: ic.color, bgColor: ic.bg } as Course)}
                  className={`p-2 rounded-lg border-2 transition text-lg ${form.icon === ic.value ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`}
                  title={ic.label}><i className={`fa-solid ${ic.value} ${ic.color}`}></i></button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">কোর্সের নাম <span className="text-red-500">*</span></label>
            <input type="text" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value } as Course)}
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="যেমন: AI কনটেন্ট ক্রিয়েশন ওয়ার্কশপ" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">বিবরণ</label>
            <textarea rows={2} value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value } as Course)}
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" placeholder="কোর্সের সংক্ষিপ্ত বিবরণ..." />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">রেগুলার প্রাইস</label>
              <input type="text" value={form.regularPrice}
                onChange={e => setForm({ ...form, regularPrice: e.target.value } as Course)}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="৳৫,০০০" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">অফার প্রাইস</label>
              <input type="text" value={form.offerPrice}
                onChange={e => setForm({ ...form, offerPrice: e.target.value } as Course)}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="৳৪০০" />
            </div>
          </div>

          {/* Highlight */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-11 h-6 rounded-full transition relative ${form.highlight ? "bg-amber-500" : "bg-slate-300"}`}
              onClick={() => setForm({ ...form, highlight: !form.highlight } as Course)}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${form.highlight ? "left-[22px]" : "left-0.5"}`}></div>
            </div>
            <span className="text-xs font-medium text-slate-700">ফিচার্ড / হাইলাইটেড কোর্স ⭐</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setActiveNav("courses"); setEditingCourse(null); setEditingId(null) }}
              className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium">বাতিল</button>
            <button onClick={handleSaveCourseForm} disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-lg transition shadow disabled:opacity-50 flex items-center gap-1.5">
              {saving ? <><i className="fa-solid fa-spinner animate-spin"></i> সেভ হচ্ছে...</> : <><i className="fa-solid fa-check"></i> সেভ করুন</>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Price Settings ----
  function PriceSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState<AppSettings | null>(null)
    useEffect(() => { setDraft(settings) }, [settings?.bundlePrice, settings?.bundleRegularPrice])
    if (!draft) return null
    const save = async () => {
      setSettingsSaving(true)
      try { await updateSettings(draft); setSettings(draft); saveSettings(draft); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }
    return (
      <div className="space-y-5 max-w-2xl">
        <div>
          <h2 className="text-xl font-black text-slate-900">বান্ডেল প্রাইস সেটিংস</h2>
          <p className="text-xs text-slate-500 mt-0.5">মেগা অফারের প্রাইস কনফিগার করুন</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">রেগুলার টোটাল প্রাইস</label>
            <input type="text" value={draft.bundleRegularPrice}
              onChange={e => setDraft({ ...draft, bundleRegularPrice: e.target.value })}
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">অফার প্রাইস (বিক্রয় মূল্য)</label>
            <input type="text" value={draft.bundlePrice}
              onChange={e => setDraft({ ...draft, bundlePrice: e.target.value })}
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <span className="text-xs text-amber-700">প্রিভিউ: </span>
            <span className="text-slate-400 line-through font-bold mx-2">{draft.bundleRegularPrice}</span>
            <span className="text-xl font-black text-emerald-600">{draft.bundlePrice}</span>
          </div>
          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ---- Timer Settings ----
  function TimerSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState<AppSettings | null>(null)
    useEffect(() => { setDraft(settings) }, [settings?.countdownMinutes, settings?.countdownSeconds])
    if (!draft) return null
    const save = async () => {
      setSettingsSaving(true)
      try { await updateSettings(draft); setSettings(draft); saveSettings(draft); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }
    return (
      <div className="space-y-5 max-w-2xl">
        <div>
          <h2 className="text-xl font-black text-slate-900">কাউন্টডাউন টাইমার</h2>
          <p className="text-xs text-slate-500 mt-0.5">অফার কতক্ষণ চলবে সেটি সেট করুন</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">মিনিট</label>
              <input type="number" min={0} max={120} value={draft.countdownMinutes}
                onChange={e => setDraft({ ...draft, countdownMinutes: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">সেকেন্ড</label>
              <input type="number" min={0} max={59} value={draft.countdownSeconds}
                onChange={e => setDraft({ ...draft, countdownSeconds: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <span className="text-xs text-slate-500">বর্তমান সেটিং: </span>
            <span className="text-2xl font-black text-slate-800 tabular-nums">
              {String(draft.countdownMinutes).padStart(2, "0")}:{String(draft.countdownSeconds).padStart(2, "0")}
            </span>
          </div>
          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ---- Tools Settings ----
  function ToolsSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState({ val: "" })
    useEffect(() => { setDraft({ val: settings.toolsAndResources || "" }) }, [settings?.toolsAndResources])
    const save = async () => {
      const updated = { ...settings, toolsAndResources: draft.val }
      setSettingsSaving(true)
      try { await updateSettings(updated); setSettings(updated); saveSettings(updated); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }
    return (
      <div className="space-y-5 max-w-2xl">
        <div><h2 className="text-xl font-black text-slate-900">টুলস ও রিসোর্সেস</h2><p className="text-xs text-slate-500 mt-0.5">বান্ডেলে কী কী টুলস থাকবে তা লিখুন</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <textarea rows={4} value={draft.val}
            onChange={e => setDraft({ val: e.target.value })}
            className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            placeholder="যেমন: Capcut Pro, Surfshark VPN, Gemini Premium..." />
          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ---- Message Settings ----
  function MessageSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState({ val: "" })
    useEffect(() => { setDraft({ val: settings.offerEndMessage || "" }) }, [settings?.offerEndMessage])
    const save = async () => {
      const updated = { ...settings, offerEndMessage: draft.val }
      setSettingsSaving(true)
      try { await updateSettings(updated); setSettings(updated); saveSettings(updated); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }
    return (
      <div className="space-y-5 max-w-2xl">
        <div><h2 className="text-xl font-black text-slate-900">অফার শেষ মেসেজ</h2><p className="text-xs text-slate-500 mt-0.5">কাউন্টডাউন শেষ হলে কী মেসেজ দেখাবে</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <input type="text" value={draft.val} onChange={e => setDraft({ val: e.target.value })}
            className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <div className="bg-red-50 rounded-lg p-4 text-center"><span className="text-xs text-red-600">প্রিভিউ: </span><span className="text-sm font-bold text-red-700">{draft.val}</span></div>
          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ---- Video Settings ----
  function VideoSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState({ url: "", title: "", thumb: "" })
    useEffect(() => {
      setDraft({ url: settings.videoUrl || "", title: settings.videoTitle || "", thumb: settings.videoThumbnail || "" })
    }, [settings?.videoUrl, settings?.videoTitle, settings?.videoThumbnail])

    // Auto-extract YouTube video ID
    const extractYoutubeId = (url: string) => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&?#\s]+)/,
        /youtube\.com\/shorts\/([^&?#\s]+)/
      ]
      for (const p of patterns) {
        const match = url.match(p)
        if (match) return match[1]
      }
      return null
    }

    const ytId = extractYoutubeId(draft.url)
    const autoThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : ""
    const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : ""
    // Use manual thumb, or auto, or fallback to hqdefault
    const finalThumb = draft.thumb || autoThumb || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "")
    const hasThumb = finalThumb.length > 5

    // Show thumbnail in a modal
    const viewThumb = () => {
      if (!finalThumb) return
      Swal.fire({
        imageUrl: finalThumb,
        imageAlt: "থাম্বনেইল",
        title: draft.title || "ভিডিও থাম্বনেইল",
        showCloseButton: true,
        showConfirmButton: false,
        width: "90%",
        customClass: {
          popup: "!rounded-2xl !shadow-2xl !bg-slate-900",
          title: "!text-white !text-sm !font-bold",
        },
      })
    }

    const save = async () => {
      // Auto-set thumbnail from YouTube if not manually provided
      const thumbToSave = draft.thumb || autoThumb || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "")
      const updated = { ...settings, videoUrl: draft.url, videoTitle: draft.title, videoThumbnail: thumbToSave }
      setSettingsSaving(true)
      try { await updateSettings(updated); setSettings(updated); saveSettings(updated); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }

    return (
      <div className="space-y-5 max-w-2xl">
        <div>
          <h2 className="text-xl font-black text-slate-900">ভিডিও সেটিংস</h2>
          <p className="text-xs text-slate-500 mt-0.5">হোমপেজের ভিডিও সেকশন ম্যানেজ করুন</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ভিডিও টাইটেল</label>
            <input type="text" value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              placeholder="যেমন: কিভাবে এই বান্ডেল আপনার লাইফ পরিবর্তন করতে পারে?"
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ভিডিও URL (YouTube লিংক দিন)
            </label>
            <input type="text" value={draft.url}
              onChange={e => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://youtu.be/xxxxxxxxxxx  বা  https://youtube.com/watch?v=xxx"
              className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            {ytId && (
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                <i className="fa-brands fa-youtube"></i> YouTube ভিডিও ডিটেক্ট হয়েছে — সেভ করলেই থাম্বনেইল অটো সেভ হবে
              </p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {hasThumb && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                থাম্বনেইল {ytId && !draft.thumb ? <span className="text-emerald-600 font-normal">(YouTube থেকে অটো)</span> : ""}
              </label>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group" onClick={viewThumb}>
                <img
                  src={finalThumb}
                  alt="Video Thumbnail"
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    // Fallback if maxresdefault doesn't exist
                    const target = e.currentTarget
                    if (ytId && !target.dataset.retried) {
                      target.dataset.retried = "1"
                      target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">
                    <i className="fa-solid fa-magnifying-glass-plus text-slate-700"></i>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-400">থাম্বনেইলে ক্লিক করে বড় করে দেখুন</p>
            </div>
          )}

          {/* YouTube Embed Preview */}
          {embedUrl ? (
            <div className="space-y-2">
              <p className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1">
                <i className="fa-solid fa-play"></i> ভিডিও প্রিভিউ
              </p>
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl + "?autoplay=0&rel=0"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                    title={draft.title}
                  />
                </div>
                <div className="p-3">
                  <p className="text-white font-bold text-xs">{draft.title || "ভিডিও প্রিভিউ"}</p>
                </div>
              </div>
            </div>
          ) : draft.url ? (
            /* Non-YouTube URL: show thumbnail preview */
            hasThumb ? (
              <div className="space-y-2">
                <p className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1">
                  <i className="fa-solid fa-image"></i> থাম্বনেইল প্রিভিউ
                </p>
                <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                  <div className="aspect-video relative" onClick={viewThumb}>
                    <img src={finalThumb} alt="Preview" className="w-full h-full object-cover cursor-pointer" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 bg-amber-500/80 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-play text-white text-xl ml-1"></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-bold text-xs">{draft.title || "ভিডিও প্রিভিউ"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-lg p-4 text-center">
                <i className="fa-solid fa-link text-slate-300 text-xl block mb-1"></i>
                <p className="text-[10px] text-slate-400">থাম্বনেইল ইমেজ URL দিন</p>
              </div>
            )
          ) : (
            <div className="bg-slate-100 rounded-xl p-6 text-center border border-dashed border-slate-300">
              <i className="fa-solid fa-video text-slate-300 text-3xl block mb-2"></i>
              <p className="text-xs text-slate-400 font-medium">YouTube ভিডিও লিংক দিন</p>
              <p className="text-[10px] text-slate-400 mt-0.5">লিংক দিলেই অটো প্রিভিউ ও থাম্বনেইল দেখাবে</p>
            </div>
          )}

          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "ভিডিও সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ---- Contact Settings ----
  function ContactSettings() {
    if (!settings) return null
    const [draft, setDraft] = useState({ wa: "", tg: "" })
    useEffect(() => { setDraft({ wa: settings.whatsappNumber || "", tg: settings.telegramLink || "" }) }, [settings?.whatsappNumber, settings?.telegramLink])
    const save = async () => {
      const updated = { ...settings, whatsappNumber: draft.wa, telegramLink: draft.tg }
      setSettingsSaving(true)
      try { await updateSettings(updated); setSettings(updated); saveSettings(updated); showToast('সেটিংস সফলভাবে সেভ হয়েছে!', 'success') }
      catch { showToast('সেটিংস সেভ করতে সমস্যা হয়েছে!', 'error') }
      finally { setSettingsSaving(false) }
    }
    return (
      <div className="space-y-5 max-w-2xl">
        <div><h2 className="text-xl font-black text-slate-900">কন্টাক্ট সেটিংস</h2><p className="text-xs text-slate-500 mt-0.5">WhatsApp ও Telegram কন্টাক্ট ম্যানেজ করুন</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center"><i className="fa-brands fa-whatsapp text-white text-sm"></i></div><h3 className="text-sm font-bold text-slate-800">WhatsApp</h3></div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">হোয়াটসঅ্যাপ নাম্বার</label>
              <input type="text" value={draft.wa} onChange={e => setDraft({ ...draft, wa: e.target.value })}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="+8801XXXXXXXXX" />
            </div>
            {draft.wa && <a href={`https://wa.me/${draft.wa.replace(/\+/g, '')}`} target="_blank" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"><i className="fa-brands fa-whatsapp"></i> টেস্ট</a>}
          </div>
          <hr className="border-slate-100" />
          <div className="space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center"><i className="fa-brands fa-telegram text-white text-sm"></i></div><h3 className="text-sm font-bold text-slate-800">Telegram</h3></div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">টেলিগ্রাম লিংক</label>
              <input type="text" value={draft.tg} onChange={e => setDraft({ ...draft, tg: e.target.value })}
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="https://t.me/yourusername" />
            </div>
            {draft.tg && <a href={draft.tg} target="_blank" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"><i className="fa-brands fa-telegram"></i> টেস্ট</a>}
          </div>
          <button onClick={save} disabled={settingsSaving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow disabled:opacity-50">
            {settingsSaving ? "সেভ হচ্ছে..." : "কন্টাক্ট সেটিংস সেভ করুন"}
          </button>
        </div>
      </div>
    )
  }

  // ==================== DASHBOARD LAYOUT ====================
  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 md:w-16"} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 ${sidebarOpen ? "fixed md:relative inset-y-0 left-0 z-50" : ""}`}>
        {/* Logo */}
        <div className={`p-4 border-b border-slate-200 ${!sidebarOpen && "md:px-2"}`}>
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 p-2 rounded-lg flex-shrink-0">
              <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
            </div>
            {sidebarOpen && <span className="font-black text-slate-900 text-sm">SKILLSHQ <span className="text-amber-500">Admin</span></span>}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
          {/* Group: Course Management */}
          <div>
            {sidebarOpen && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">কোর্স ম্যানেজমেন্ট</p>}
            {NAV_ITEMS.filter(n => n.section === "কোর্স ম্যানেজমেন্ট").map(item => (
              <button key={item.id} onClick={() => { handleNavChange(item.id); if (item.id !== "add-course") { setEditingCourse(null); setEditingId(null) } }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-1 ${
                  activeNav === item.id ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}>
                <i className={`fa-solid ${item.icon} text-base w-5 text-center ${activeNav === item.id ? "text-amber-500" : "text-slate-400"}`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Group: Order Management */}
          <div>
            {sidebarOpen && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">অর্ডার ম্যানেজমেন্ট</p>}
            {NAV_ITEMS.filter(n => n.section === "অর্ডার ম্যানেজমেন্ট").map(item => (
              <button key={item.id} onClick={() => handleNavChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-1 ${
                  activeNav === item.id ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}>
                <i className={`fa-solid ${item.icon} text-base w-5 text-center ${activeNav === item.id ? "text-amber-500" : "text-slate-400"}`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Group: Content Management */}
          <div>
            {sidebarOpen && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">কন্টেন্ট ম্যানেজমেন্ট</p>}
            {NAV_ITEMS.filter(n => n.section === "কন্টেন্ট ম্যানেজমেন্ট").map(item => (
              <button key={item.id} onClick={() => handleNavChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-1 ${
                  activeNav === item.id ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}>
                <i className={`fa-solid ${item.icon} text-base w-5 text-center ${activeNav === item.id ? "text-amber-500" : "text-slate-400"}`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Group: Offer Settings */}
          <div>
            {sidebarOpen && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">অফার সেটিংস</p>}
            {NAV_ITEMS.filter(n => n.section === "অফার সেটিংস").map(item => (
              <button key={item.id} onClick={() => handleNavChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-1 ${
                  activeNav === item.id ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-600 hover:bg-slate-100"
                }`}>
                <i className={`fa-solid ${item.icon} text-base w-5 text-center ${activeNav === item.id ? "text-amber-500" : "text-slate-400"}`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-200 space-y-1">
          <a href="/" target="_blank" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition font-medium`}>
            <i className="fa-solid fa-arrow-up-right-from-square text-xs w-5 text-center"></i>
            {sidebarOpen && "সাইট দেখুন"}
          </a>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition font-medium`}>
            <i className="fa-solid fa-right-from-bracket text-xs w-5 text-center"></i>
            {sidebarOpen && "লগআউট"}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500">
              <i className={`fa-solid ${sidebarOpen ? "fa-bars-staggered" : "fa-bars"} text-lg`}></i>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {NAV_ITEMS.find(n => n.id === activeNav)?.section} / {NAV_ITEMS.find(n => n.id === activeNav)?.label}
            </span>
          </div>
          <button onClick={loadData} className="text-xs text-slate-400 hover:text-slate-600 transition font-medium flex items-center gap-1.5" title="রিফ্রেশ">
            <i className="fa-solid fa-rotate"></i> রিফ্রেশ
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <i className="fa-solid fa-spinner animate-spin text-3xl text-amber-500"></i>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  )
}
