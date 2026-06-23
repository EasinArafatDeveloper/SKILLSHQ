import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"

// GET /api/dashboard — get user's private dashboard data (secure)
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const token = req.cookies.get("shq_auth")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await RegistrationModel.findOne({ authToken: token }).select(
      "name email phone status privateLinks telegramLink transactionId amount paymentMethod createdAt"
    )

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Only return private links and telegram link if status is "completed"
    const isCompleted = user.status === "completed"

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      transactionId: user.transactionId,
      amount: user.amount,
      paymentMethod: user.paymentMethod,
      createdAt: user.createdAt,
      // Only expose private content when completed
      privateLinks: isCompleted ? user.privateLinks : [],
      telegramLink: isCompleted ? user.telegramLink : "",
      isCompleted,
    })
  } catch (err) {
    console.error("GET /api/dashboard error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
