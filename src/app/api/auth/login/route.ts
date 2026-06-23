import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"
import crypto from "crypto"

// POST /api/auth/login — login by email OR phone, returns dashboard data directly
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, phone } = await req.json()

    const query: Record<string, string> = {}
    if (email) query.email = email.trim().toLowerCase()
    else if (phone) query.phone = phone.trim()
    else {
      return NextResponse.json({ error: "ইমেইল অথবা ফোন নম্বর দিন" }, { status: 400 })
    }

    const user = await RegistrationModel.findOne(query)
    if (!user) {
      return NextResponse.json({ error: "এই তথ্যে কোনো রেজিস্ট্রেশন পাওয়া যায়নি" }, { status: 404 })
    }

    // Generate unique auth token
    const token = crypto.randomBytes(32).toString("hex")
    user.authToken = token
    await user.save()

    const isCompleted = user.status === "completed"

    // Return full dashboard data directly
    const res = NextResponse.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      paymentMethod: user.paymentMethod,
      amount: user.amount,
      transactionId: user.transactionId,
      createdAt: user.createdAt,
      privateLinks: isCompleted ? user.privateLinks : [],
      telegramLink: isCompleted ? user.telegramLink : "",
      telegramClicked: isCompleted ? user.telegramClicked : false,
      isCompleted,
    })

    res.cookies.set("shq_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })

    return res
  } catch (err) {
    console.error("POST /api/auth/login error:", err)
    return NextResponse.json({ error: "লগইন করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
