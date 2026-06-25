import mongoose, { Schema, Document } from "mongoose"

export interface ISettings extends Document {
  key: string
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
  dashboardNotice: string
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, default: "main", unique: true },
    bundlePrice: { type: String, default: "৳৬৫০" },
    bundleRegularPrice: { type: String, default: "৳১,২০,০০০" },
    countdownMinutes: { type: Number, default: 10 },
    countdownSeconds: { type: Number, default: 0 },
    toolsAndResources: { type: String, default: "" },
    offerEndMessage: { type: String, default: "অফারটির মেয়াদ শেষ হয়ে গেছে!" },
    videoUrl: { type: String, default: "" },
    videoTitle: { type: String, default: "কিভাবে এই সিঙ্গেল বান্ডেল আপনার লাইফ পরিবর্তন করতে পারে?" },
    videoThumbnail: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    telegramLink: { type: String, default: "" },
    topRibbonText: { type: String, default: "বিশেষ মেগা অফার: আজ রাত ১২টা পর্যন্ত সব কোর্স এবং Canva Premium একদম ফ্রি!" },
    dashboardNotice: { type: String, default: "" },
  },
  { timestamps: true }
)

export const SettingsModel = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema)
