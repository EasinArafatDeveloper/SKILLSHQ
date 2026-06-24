import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/models/Course"

// PUT — update course
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    // Strip MongoDB internal fields to avoid immutable _id error
    const { _id, __v, createdAt, updatedAt, courseId: _cid, id: _idField, ...cleanBody } = body
    const course = await CourseModel.findOneAndUpdate(
      { courseId: params.id },
      { $set: cleanBody },
      { new: true }
    )
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })
    return NextResponse.json(course)
  } catch (err) {
    console.error("PUT /api/courses error:", err)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// DELETE — remove course
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const course = await CourseModel.findOneAndDelete({ courseId: params.id })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/courses error:", err)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
