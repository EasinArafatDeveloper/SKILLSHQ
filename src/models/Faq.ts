import mongoose, { Schema, Document } from "mongoose"

export interface IFaq extends Document {
  faqId: string
  question: string
  answer: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const FaqSchema = new Schema<IFaq>(
  {
    faqId: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const FaqModel = mongoose.models.Faq || mongoose.model<IFaq>("Faq", FaqSchema)
