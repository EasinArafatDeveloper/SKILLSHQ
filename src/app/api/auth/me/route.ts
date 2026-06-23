import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"

// GET /api/auth/me — get current user + dashboard data by cookie token
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const token = req.cookies.get("shq_auth")?.value

    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 401 })
    }

    const user = await RegistrationModel.findOne({ authToken: token }).select("-authToken -screenshot")
    if (!user) {
      const res = NextResponse.json({ loggedIn: false }, { status: 401 })
      res.cookies.set("shq_auth", "", { maxAge: 0, path: "/" })
      return res
    }

    const isCompleted = user.status === "completed"

    return NextResponse.json({
      loggedIn: true,
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
  } catch (err) {
    console.error("GET /api/auth/me error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// POST /api/auth/me — logout (clear cookie)
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.set("shq_auth", "", { maxAge: 0, path: "/" })
  return res
}
