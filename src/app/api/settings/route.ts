import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { SettingsModel } from "@/models/Settings"

export const dynamic = "force-dynamic"

// GET settings
export async function GET() {
  try {
    await connectDB()
    let settings = await SettingsModel.findOne({ key: "main" })
    if (!settings) {
      settings = await SettingsModel.create({ key: "main" })
    }
    return NextResponse.json(settings)
  } catch (err) {
    console.error("GET /api/settings error:", err)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

// PUT update settings
export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    // Strip MongoDB internal fields to avoid immutable _id error
    const { _id, __v, createdAt, updatedAt, key: _key, ...cleanBody } = body
    const settings = await SettingsModel.findOneAndUpdate(
      { key: "main" },
      { $set: cleanBody },
      { new: true, upsert: true }
    )
    return NextResponse.json(settings)
  } catch (err) {
    console.error("PUT /api/settings error:", err)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
