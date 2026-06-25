import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/models/Course"

export const dynamic = "force-dynamic"

// GET — all courses
export async function GET() {
  try {
    await connectDB()
    const courses = await CourseModel.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(courses, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    })
  } catch (err) {
    console.error("GET /api/courses error:", err)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST — add new course
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const course = await CourseModel.create(body)
    return NextResponse.json(course, { status: 201 })
  } catch (err) {
    console.error("POST /api/courses error:", err)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
