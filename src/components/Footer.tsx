export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-300 p-2 rounded-xl text-slate-950 text-lg">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="text-lg font-black text-white">
              SKILLS<span className="text-amber-400">HQ</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            আমরা তরুণদের স্কিল ডেভলপমেন্ট এবং আইটি সলিউশন সহজ করতে ক্রমাগত কাজ করে যাচ্ছি। প্রিমিয়াম বান্ডেল সার্ভিস ও টুলস প্রদানের মাধ্যমে আমরা সর্বদা বিশ্বস্ততার প্রথম কাতারে।
          </p>
          <div className="text-[10px] text-slate-500 font-semibold bg-slate-800 p-2 rounded inline-block">
            <span>Our Trade License Number: TRAD/DSCC/011867/2025</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">প্রয়োজনীয় লিংক</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#" className="hover:text-white transition">হোম পেইজ</a></li>
            <li><a href="#" className="hover:text-white transition">শর্তাবলী ও পলিসি</a></li>
            <li><a href="#" className="hover:text-white transition">যোগাযোগ করুন</a></li>
            <li><a href="#" className="hover:text-white transition">সাপোর্ট সেন্টার</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">নিরাপত্তা ও পেমেন্ট</h4>
          <p className="text-xs text-slate-400">নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে ১০০% সিকিউর ট্রানজেকশন সম্পন্ন করুন।</p>
          <div className="flex justify-center md:justify-start gap-3 text-2xl text-slate-400">
            <i className="fa-brands fa-cc-visa hover:text-white transition"></i>
            <i className="fa-brands fa-cc-mastercard hover:text-white transition"></i>
            <i className="fa-solid fa-wallet hover:text-white transition" title="Mobile Banking"></i>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
        <p>&copy; ২০২৬ SkillsHQ. All Rights Reserved. Designed to elevate your future.</p>
      </div>
    </footer>
  )
}
