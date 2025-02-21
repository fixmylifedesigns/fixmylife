// src/app/api/posts/schedule/route.js
import { NextResponse } from "next/server";
import { PostService } from "@/services/posts";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      scheduledFor,
      sourceUrl,
      thumbnailUrl,
      visibility = "PUBLIC",
      categoryId,
      tags = [],
    } = await req.json();

    // Validate required fields
    if (!title || !description || !scheduledFor || !sourceUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate scheduledFor date
    const scheduleDate = new Date(scheduledFor);
    if (isNaN(scheduleDate) || scheduleDate < new Date()) {
      return NextResponse.json(
        { error: "Invalid scheduling date" },
        { status: 400 }
      );
    }

    const postService = new PostService();

    // Create the scheduled post
    const post = await postService.createPost({
      title,
      description,
      scheduledFor: scheduleDate,
      sourceUrl,
      thumbnailUrl,
      userId: session.user.id,
      visibility,
      categoryId,
      tags,
    });

    return NextResponse.json({
      success: true,
      post,
      message: "Post scheduled successfully",
    });
  } catch (error) {
    console.error("Error in schedule post API:", error);

    return NextResponse.json(
      {
        error: "Failed to schedule post",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postService = new PostService();
    const posts = await postService.getUserPosts(session.user.id, "SCHEDULED");

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch scheduled posts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
