import mongoose, { Schema, Document } from "mongoose"

export interface ICourse extends Document {
  courseId: string
  icon: string
  iconColor: string
  bgColor: string
  title: string
  desc: string
  regularPrice: string
  offerPrice: string
  highlight: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    courseId: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    iconColor: { type: String, required: true },
    bgColor: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, default: "" },
    regularPrice: { type: String, required: true },
    offerPrice: { type: String, required: true },
    highlight: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const CourseModel = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)
