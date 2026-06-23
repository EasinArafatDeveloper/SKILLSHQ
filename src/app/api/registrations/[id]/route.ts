import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RegistrationModel } from "@/models/Registration"
import { sendApprovalEmail } from "@/lib/email"

// PATCH — update registration (any fields: status, privateLinks, telegramLink, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const update: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(body)) {
      update[key] = value
    }

    // Fetch existing first to check if we need to send approval email
    const existing = await RegistrationModel.findById(params.id)

    const registration = await RegistrationModel.findByIdAndUpdate(
      params.id,
      { $set: update },
      { returnDocument: "after", runValidators: true }
    )
    if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Send approval email when status is set to completed (only once)
    if (body.status === "completed" && existing && existing.status !== "completed") {
      const orderId = registration._id.toString().slice(-8).toUpperCase()
      sendApprovalEmail({
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        orderId,
        transactionId: registration.transactionId || "",
        amount: registration.amount || "৳৬৫০",
        telegramLink: body.telegramLink || registration.telegramLink || "",
      }).catch(err => console.error("Approval email failed:", err))
    }

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
