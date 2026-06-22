export default function Features() {
  return (
    <section className="py-16 bg-white border-y border-slate-200 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Features & Benefits</span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900">এই মেগা বান্ডেলটি কেন আপনার লাইফকে সহজ করবে?</h3>
          <p className="text-sm text-slate-500">আলাদা আলাদা কোর্স কিনে হাজার হাজার টাকা নষ্ট না করে একটি মাস্টার অফারে সবকিছু বুঝে নিন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 hover:border-amber-500 hover:bg-white hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition duration-300">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">কমপ্লিট কোর্স কারিকুলাম</h4>
            <p className="text-xs text-slate-600 leading-relaxed">১ লক্ষ ২০ হাজার টাকার উপরে মার্কেটের শীর্ষ মেন্টরদের ভিডিও এডিটিং, ডিজিটাল মার্কেটিং এবং এআই ওয়ার্কশপ রয়েছে একসাথে।</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 hover:border-emerald-500 hover:bg-white hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition duration-300">
              <i className="fa-solid fa-toolbox text-xl"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">লাইসেন্সড টুলস ও প্রিসেট</h4>
            <p className="text-xs text-slate-600 leading-relaxed">সার্ফশার্ক ভিপিএন, জেমিনি প্রিমিয়াম প্রম্পটস, ক্যাপকাট এবং ইনশট প্রো-এর মতো প্রয়োজনীয় কাজের টুলস পাচ্ছেন একদম ফ্রি!</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition duration-300">
              <i className="fa-solid fa-infinity text-xl"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">লাইফটাইম ক্লাউড অ্যাক্সেস</h4>
            <p className="text-xs text-slate-600 leading-relaxed">একবার পেমেন্ট করলেই সবগুলো ড্রাইভ ফোল্ডারের লাইফটাইম অ্যাক্সেস পাবেন। যেকোনো সময় দেখতে বা ডাউনলোড করতে পারবেন।</p>
          </div>
        </div>
      </div>
    </section>
  )
}
