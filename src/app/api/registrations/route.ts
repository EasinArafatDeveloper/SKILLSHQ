import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"
import { sendOrderConfirmationEmail } from "@/lib/email"
import crypto from "crypto"

export const dynamic = "force-dynamic"

// GET — all registrations
export async function GET() {
  try {
    await connectDB()
    const registrations = await RegistrationModel.find().sort({ createdAt: -1 })
    return NextResponse.json(registrations, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    })
  } catch (err) {
    console.error("GET /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

// POST — new registration (auto-login: generates token + sets cookie)
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // Generate unique auth token for auto-login
    const authToken = crypto.randomBytes(32).toString("hex")

    const registration = await RegistrationModel.create({
      ...body,
      authToken,
    })

    // Send confirmation email (fire and forget - don't block response)
    const orderId = registration._id.toString().slice(-8).toUpperCase()
    sendOrderConfirmationEmail({
      name: body.name,
      email: body.email,
      phone: body.phone,
      orderId,
      transactionId: body.transactionId || "",
      amount: body.amount || "৳৬৫০",
      paymentMethod: body.paymentMethod || "bkash",
    }).catch(err => console.error("Email send failed:", err))

    // Set auth cookie for auto-login
    const res = NextResponse.json(registration, { status: 201 })
    res.cookies.set("shq_auth", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })

    return res
  } catch (err) {
    console.error("POST /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
