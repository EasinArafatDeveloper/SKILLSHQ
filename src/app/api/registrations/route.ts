import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"
import crypto from "crypto"

// GET — all registrations
export async function GET() {
  try {
    await connectDB()
    const registrations = await RegistrationModel.find().sort({ createdAt: -1 })
    return NextResponse.json(registrations)
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

    // Set auth cookie for auto-login
    const res = NextResponse.json(registration, { status: 201 })
    res.cookies.set("shq_auth", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return res
  } catch (err) {
    console.error("POST /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
