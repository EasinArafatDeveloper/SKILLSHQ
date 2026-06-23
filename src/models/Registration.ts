import mongoose, { Schema, Document } from "mongoose"

export interface IPrivateLink {
  courseTitle: string
  link: string
  unlockedAt?: Date
  clicked: boolean
  clickedAt?: Date
}

export interface IRegistration extends Document {
  name: string
  phone: string
  email: string
  paymentMethod: string
  amount: string
  transactionId: string
  screenshot: string
  status: "pending" | "completed" | "cancelled"
  authToken: string
  privateLinks: IPrivateLink[]
  telegramLink: string
  telegramClicked: boolean
  telegramClickedAt?: Date
  createdAt: Date
}

const PrivateLinkSchema = new Schema<IPrivateLink>(
  {
    courseTitle: { type: String, required: true },
    link: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    clicked: { type: Boolean, default: false },
    clickedAt: { type: Date, default: null },
  },
  { _id: true }
)

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: { type: String, default: "bkash" },
    amount: { type: String, default: "৳৬৫০" },
    transactionId: { type: String, default: "" },
    screenshot: { type: String, default: "" },
    status: { type: String, default: "pending", enum: ["pending", "completed", "cancelled"] },
    authToken: { type: String, default: "" },
    privateLinks: { type: [PrivateLinkSchema], default: [] },
    telegramLink: { type: String, default: "" },
    telegramClicked: { type: Boolean, default: false },
    telegramClickedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const RegistrationModel = mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema)
