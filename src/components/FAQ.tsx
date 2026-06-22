"use client"

import { useState } from "react"

const faqs = [
  {
    q: "কোর্সগুলো কি লাইভ হবে নাকি প্রি-রেকর্ডেড?",
    a: "কোর্সগুলো সম্পূর্ণ প্রি-রেকর্ডেড প্রিমিয়াম ভিডিও মডিউল যা ড্রাইভে আপলোড করা আছে। ফলে আপনি আপনার সুবিধাজনক যেকোনো সময়ে ঘরে বসেই শিখতে পারবেন।",
  },
  {
    q: "ক্যানভা প্রিমিয়াম প্রজেক্ট লিংক কিভাবে এক্টিভ করবো?",
    a: "অর্ডার সফল হওয়ার পরপরই ইমেইলে ড্রাইভ অ্যাক্সেস লিংকের সাথে একটি বিশেষ \"Canva Team Activation Link\" পাঠানো হবে। লিংকে ক্লিক করলেই আপনার সাধারণ ক্যানভা অ্যাকাউন্ট অটোমেটিক্যালি প্রিমিয়াম হয়ে যাবে।",
  },
  {
    q: "ড্রাইভ লিংকের মেয়াদ কতদিন থাকবে?",
    a: "আপনার ড্রাইভ লিংকের অ্যাক্সেস থাকবে একদম লাইফটাইমের জন্য। কোনো রিনিউয়াল বা অতিরিক্ত চার্জ ছাড়াই আপনি আজীবন ফাইলগুলো ব্যবহার করতে পারবেন।",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 bg-[#F8FAFC]">
      <div className="text-center space-y-3 mb-10">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Common Questions</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">সাধারণ কিছু জিজ্ঞাসিত প্রশ্ন (FAQ)</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white border border-slate-200 cursor-pointer group hover:border-amber-400/50 transition-all duration-300"
            onClick={() => toggleFaq(index)}
          >
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition">{faq.q}</h4>
              <span className="text-xs text-slate-500">
                <i className={`fa-solid ${openIndex === index ? "fa-chevron-up text-amber-600" : "fa-chevron-down"}`}></i>
              </span>
            </div>
            {openIndex === index && (
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed border-t border-slate-100 pt-2.5">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
