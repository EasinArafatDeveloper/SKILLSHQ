import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"

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

// POST — new registration
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const registration = await RegistrationModel.create(body)
    return NextResponse.json(registration, { status: 201 })
  } catch (err) {
    console.error("POST /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
