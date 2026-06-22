# SkillsHub - Course Platform Landing Page

একটি আধুনিক এবং সাড়াদায়ক কোর্স প্ল্যাটফর্ম ল্যান্ডিং পেজ যা Next.js এবং Tailwind CSS দিয়ে তৈরি।

## বৈশিষ্ট্য

- ✨ আকর্ষণীয় হিরো সেকশন
- 📚 কোর্স লিস্টিং এবং মূল্য নির্ধারণ
- 🎨 সুন্দর UI/UX ডিজাইন
- 📱 সম্পূর্ণ রেসপন্সিভ
- ⚡ দ্রুত পারফরম্যান্স
- 🌙 সুগম নেভিগেশন

## প্রযুক্তি স্ট্যাক

- **Next.js 14** - React ফ্রেমওয়ার্ক
- **TypeScript** - টাইপ সেফটির জন্য
- **Tailwind CSS** - ইউটিলিটি-ফার্স্ট CSS
- **React 18** - UI লাইব্রেরি

## শুরু করুন

### ইনস্টলেশন

```bash
npm install
# অথবা
yarn install
```

### ডেভেলপমেন্ট সার্ভার চালান

```bash
npm run dev
# অথবা
yarn dev
```

ব্রাউজারে খুলুন [http://localhost:3000](http://localhost:3000)

### প্রোডাকশনের জন্য বিল্ড করুন

```bash
npm run build
npm start
```

## প্রজেক্ট স্ট্রাকচার

```
src/
├── app/
│   ├── layout.tsx      # মেইন লেআউট
│   ├── page.tsx        # হোম পেজ
│   └── globals.css     # গ্লোবাল স্টাইল
└── components/
    ├── Header.tsx      # নেভিগেশন হেডার
    ├── Hero.tsx        # হিরো সেকশন
    ├── Features.tsx    # ফিচার সেকশন
    ├── Courses.tsx     # কোর্স লিস্টিং
    ├── Pricing.tsx     # মূল্য নির্ধারণ
    ├── Testimonials.tsx # পর্যালোচনা
    ├── CTA.tsx         # কল টু অ্যাকশন
    └── Footer.tsx      # ফুটার
```

## কাস্টমাইজেশন

### রঙ পরিবর্তন করুন

`tailwind.config.ts` এ কাস্টম রঙ যোগ করুন:

```typescript
colors: {
  primary: "#0066CC",
  secondary: "#FF6B35",
  // আপনার রঙ এখানে যোগ করুন
}
```

### কন্টেন্ট সম্পাদনা করুন

প্রতিটি কম্পোনেন্টে টেক্সট, কোর্স এবং মূল্য সরাসরি সম্পাদনা করুন।

## আরও তথ্য

- [Next.js ডকুমেন্টেশন](https://nextjs.org/docs)
- [Tailwind CSS ডকুমেন্টেশন](https://tailwindcss.com/docs)

## লাইসেন্স

MIT License - বিস্তারিত জানতে LICENSE ফাইল দেখুন।
