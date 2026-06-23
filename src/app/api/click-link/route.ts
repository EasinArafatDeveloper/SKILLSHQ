import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"

// POST /api/click-link — mark a private link OR telegram link as clicked (one-time access)
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const token = req.cookies.get("shq_auth")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { linkId, type } = await req.json()

    const user = await RegistrationModel.findOne({ authToken: token })
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Telegram link click
    if (type === "telegram") {
      if (user.telegramClicked) {
        return NextResponse.json({ error: "Telegram already joined", alreadyClicked: true }, { status: 403 })
      }
      user.telegramClicked = true
      user.telegramClickedAt = new Date()
      await user.save()
      return NextResponse.json({ success: true, link: user.telegramLink })
    }

    // Course link click
    if (!linkId) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 })
    }

    const link = (user.privateLinks as any).id(linkId)
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    if (link.clicked) {
      return NextResponse.json({ error: "Link already used", alreadyClicked: true }, { status: 403 })
    }

    link.clicked = true
    link.clickedAt = new Date()
    await user.save()

    return NextResponse.json({ success: true, link: link.link })
  } catch (err) {
    console.error("POST /api/click-link error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
