// src/app/api/upload-youtube/route.js
import { NextResponse } from "next/server";
import { YouTubeService } from "@/services/youtube";
import { PublishedPostsService } from "@/services/publishedPosts";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoUrl, accessToken, metadata } = await req.json();
    if (!videoUrl || !accessToken) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Initialize services
    const youtubeService = new YouTubeService(accessToken);
    const publishedPostsService = new PublishedPostsService();

    // Upload to YouTube
    const { success, videoId, message } = await youtubeService.uploadToYouTube(
      videoUrl,
      metadata
    );

    if (!success || !videoId) {
      throw new Error("Failed to upload video to YouTube");
    }

    // Save to database
    const publishedPost = await publishedPostsService.createPublishedPost({
      platformPostId: videoId,
      title: metadata.snippet.title,
      description: metadata.snippet.description,
      thumbnailUrl: metadata.snippet.thumbnails?.default?.url,
      userId: session.user.id,
      platform: "YOUTUBE",
    });

    return NextResponse.json({
      success: true,
      videoId,
      publishedPost,
      message: "Video successfully uploaded and saved",
    });
  } catch (error) {
    console.error("Error in upload-youtube API:", error);

    // Handle specific error types
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Authentication failed", details: error.message },
        { status: 401 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: "Access forbidden", details: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
