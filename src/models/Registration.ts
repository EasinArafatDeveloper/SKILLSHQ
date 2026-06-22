import mongoose, { Schema, Document } from "mongoose"

export interface IRegistration extends Document {
  name: string
  phone: string
  email: string
  paymentMethod: string
  amount: string
  status: "pending" | "completed" | "cancelled"
  createdAt: Date
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: { type: String, default: "bkash" },
    amount: { type: String, default: "৳৬৫০" },
    status: { type: String, default: "pending", enum: ["pending", "completed", "cancelled"] },
  },
  { timestamps: true }
)

export const RegistrationModel = mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema)
