import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { FaqModel } from "@/models/Faq"

export const dynamic = "force-dynamic"

// GET all FAQs
export async function GET() {
  try {
    await connectDB()
    const faqs = await FaqModel.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(faqs)
  } catch (err) {
    console.error("GET /api/faqs error:", err)
    return NextResponse.json({ error: "Failed to fetch faqs" }, { status: 500 })
  }
}

// POST new FAQ
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    // Generate a simple unique ID if not provided
    const faqId = body.faqId || Math.random().toString(36).substring(2, 9)
    const faq = await FaqModel.create({ ...body, faqId })
    return NextResponse.json(faq, { status: 201 })
  } catch (err) {
    console.error("POST /api/faqs error:", err)
    return NextResponse.json({ error: "Failed to create faq" }, { status: 500 })
  }
}
