import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"

// PATCH — update registration status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const registration = await RegistrationModel.findByIdAndUpdate(params.id, body, { new: true })
    if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(registration)
  } catch (err) {
    console.error("PATCH /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// DELETE — remove registration
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await RegistrationModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/registrations error:", err)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
