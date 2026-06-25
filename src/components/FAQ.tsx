"use client"

import { useState, useEffect } from "react"
import { Faq, fetchFaqs, getFaqs, saveFaqs } from "@/lib/store"

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFaqs()
        setFaqs(data)
        saveFaqs(data)
      } catch {
        setFaqs(getFaqs())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) {
    return (
      <section className="py-16 max-w-4xl mx-auto px-4 bg-[#F8FAFC]">
        <div className="text-center space-y-3 mb-10">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Common Questions</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">সাধারণ কিছু জিজ্ঞাসিত প্রশ্ন (FAQ)</h3>
        </div>
        <div className="flex justify-center items-center py-10">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-amber-500"></i>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) return null

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 bg-[#F8FAFC]">
      <div className="text-center space-y-3 mb-10">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Common Questions</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">সাধারণ কিছু জিজ্ঞাসিত প্রশ্ন (FAQ)</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.faqId || index}
            className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer group hover:border-amber-400/50 transition-all duration-300"
            onClick={() => toggleFaq(index)}
          >
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition">{faq.question}</h4>
              <span className="text-xs text-slate-500">
                <i className={`fa-solid ${openIndex === index ? "fa-chevron-up text-amber-600" : "fa-chevron-down"}`}></i>
              </span>
            </div>
            {openIndex === index && (
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed border-t border-slate-100 pt-2.5">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
