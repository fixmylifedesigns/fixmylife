// src/app/api/publish-facebook/route.js
import { NextResponse } from "next/server";
import { FacebookService } from "@/services/facebook";
import { PublishedPostsService } from "@/services/publishedPosts";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * GET - Documentation for the endpoint
 */
export async function GET(req) {
  return NextResponse.json({
    message:
      "This endpoint requires a POST request with Facebook credentials and video URL",
    usage: {
      method: "POST",
      contentType: "application/json",
      body: {
        facebookAccessToken: "your_facebook_access_token",
        videoUrl: "direct_url_to_your_video",
        title: "Video title (optional)",
        description: "Video description (optional)",
        targetId: "page_id_or_me (optional)",
        privacy: "EVERYONE, FRIENDS, or ONLY_ME (optional)",
      },
    },
  });
}

/**
 * POST - Publish a video to Facebook
 */
export async function POST(req) {
  try {
    // Check user authentication (optional if you have Facebook token)
    const session = await getServerSession(authOptions);

    // Parse request data
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request format", details: parseError.message },
        { status: 400 }
      );
    }

    // Extract parameters with defaults
    const {
      facebookAccessToken,
      videoUrl,
      title = "",
      description = "",
      targetId = "me",
      privacy = "EVERYONE",
    } = reqBody;

    // Validate required parameters
    if (!facebookAccessToken) {
      return NextResponse.json(
        { error: "Facebook access token is required" },
        { status: 400 }
      );
    }

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    // Initialize services
    const facebookService = new FacebookService(facebookAccessToken);

    // Try to get PublishedPostsService if it exists in your codebase
    let publishedPostsService;
    try {
      publishedPostsService = new PublishedPostsService();
    } catch (serviceError) {
      console.log("PublishedPostsService not available, continuing without it");
    }

    // Upload to Facebook
    const result = await facebookService.uploadToFacebook(videoUrl, {
      title,
      description,
      targetId,
      privacy,
    });

    if (!result.success || !result.videoId) {
      throw new Error("Failed to upload video to Facebook");
    }

    // Save to database if we have the service and user session
    let publishedPost = null;
    if (publishedPostsService && session?.user?.id) {
      try {
        publishedPost = await publishedPostsService.createPublishedPost({
          platformPostId: result.videoId,
          title,
          description,
          // Thumbnail URL is not typically returned by Facebook
          thumbnailUrl: null,
          userId: session.user.id,
          platform: "FACEBOOK",
        });
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
        // Continue even if database save fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      videoId: result.videoId,
      url: result.url,
      publishedPost,
      message: "Video successfully published to Facebook",
    });
  } catch (error) {
    console.error("Error in publish-facebook API:", error);

    // Handle specific error types
    if (error.code === 190) {
      return NextResponse.json(
        { error: "Facebook authentication failed", details: error.message },
        { status: 401 }
      );
    }

    if (error.code === 10 || error.code === 200) {
      return NextResponse.json(
        { error: "Facebook permission denied", details: error.message },
        { status: 403 }
      );
    }

    // General error
    return NextResponse.json(
      {
        error: "Facebook upload failed",
        details: error.message,
        type: error.type,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
