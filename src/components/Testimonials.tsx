export default function Testimonials() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Our Guide vs Other Sources</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">কেন এই বান্ডেলটি অন্য যেকোনো সোর্সের চেয়ে সেরা?</h3>
        <p className="text-sm text-slate-500">নিচের সাধারণ তুলনাটি দেখলে বুঝতে পারবেন কেন আমাদের ইউজাররা আমাদের ওপর সম্পূর্ণ আস্থা রাখেন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Other Sources (Bad Card) */}
        <div className="p-6 rounded-2xl bg-white border border-red-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-red-100 pb-3">
            <span className="text-red-500 text-lg"><i className="fa-solid fa-circle-xmark"></i></span>
            <h4 className="text-base font-bold text-slate-800">অন্যান্য সাধারণ বা ফ্রি সোর্স</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-minus text-red-500 mt-0.5"></i> <span>সাধারণ ও ব্যাকডেটেড ফাইল শেয়ারিং লিংক।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-minus text-red-500 mt-0.5"></i> <span>ফাইল নষ্ট বা লিংক ঘন ঘন ডিজেবল হয়ে যায়।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-minus text-red-500 mt-0.5"></i> <span>কোনো ক্যানভা প্রিমিয়াম বা কাস্টমার সাপোর্ট নেই।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-minus text-red-500 mt-0.5"></i> <span>হিডেন চার্জ বা ম্যালওয়্যার অ্যাটাকের ভয় থাকে।</span>
            </li>
          </ul>
        </div>

        {/* Our Bundle (Good Card) */}
        <div className="p-6 rounded-2xl bg-amber-50/30 border-2 border-amber-500/80 space-y-4 relative overflow-hidden shadow-md">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2.5 border-b border-amber-200 pb-3">
            <span className="text-amber-600 text-lg"><i className="fa-solid fa-circle-check"></i></span>
            <h4 className="text-base font-bold text-slate-900">আমাদের মেগা প্রিমিয়াম সার্ভিস</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 font-medium">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i> <span>ড্রাইভ লিংকের লাইফটাইম হাই-স্পিড সিকিউর অ্যাক্সেস।</span>
            </li>
            <li className="flex items-start gap-2.5 font-medium">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i> <span>আপডেট ও নতুন কনটেন্ট ফ্রিতে অটোমেটিক যোগ হবে।</span>
            </li>
            <li className="flex items-start gap-2.5 font-medium">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i> <span>ফুল বোনাস: সম্পূর্ণ ক্যানভা প্রিমিয়াম লাইসেন্স একদম ফ্রি।</span>
            </li>
            <li className="flex items-start gap-2.5 font-medium">
              <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i> <span>২৪/৭ ডেডিকেটেড হোয়াটসঅ্যাপ সাপোর্ট নিশ্চিত।</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
