import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { FaqModel } from "@/models/Faq"

export const dynamic = "force-dynamic"

// PUT — update faq
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    // Strip MongoDB internal fields to avoid immutable _id error
    const { _id, __v, createdAt, updatedAt, faqId: _fid, id: _idField, ...cleanBody } = body
    const faq = await FaqModel.findOneAndUpdate(
      { faqId: params.id },
      { $set: cleanBody },
      { new: true }
    )
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    return NextResponse.json(faq)
  } catch (err) {
    console.error("PUT /api/faqs error:", err)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// DELETE — remove faq
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const faq = await FaqModel.findOneAndDelete({ faqId: params.id })
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/faqs error:", err)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
