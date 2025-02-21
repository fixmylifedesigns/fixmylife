import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { authOptions } from "@/lib/auth";

/**
 * API route handler for YouTube Analytics data
 * This route fetches analytics data from the YouTube Analytics API
 * Required query parameters: startDate, endDate
 * Optional query parameters: metrics (default: views,estimatedMinutesWatched,averageViewDuration)
 */
export async function GET(request) {
  try {
    // Extract query parameters
    const searchParams = new URL(request.url).searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const metrics =
      searchParams.get("metrics") ||
      "views,estimatedMinutesWatched,averageViewDuration";

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: startDate and endDate are required",
        },
        { status: 400 }
      );
    }

    // Get user session with the access token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        {
          error:
            "Authentication required. Please log in with your YouTube account.",
        },
        { status: 401 }
      );
    }

    // Set up the YouTube Analytics API client
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      access_token: session.accessToken,
    });

    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth,
    });

    // First, get the user's channel ID
    const youtube = google.youtube({
      version: "v3",
      auth,
    });

    const channelResponse = await youtube.channels.list({
      part: "id",
      mine: true,
    });

    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0
    ) {
      return NextResponse.json(
        { error: "No YouTube channel found for this account" },
        { status: 404 }
      );
    }

    const channelId = channelResponse.data.items[0].id;

    // Make the API request to YouTube Analytics
    const analyticsResponse = await youtubeAnalytics.reports.query({
      ids: `channel==${channelId}`,
      startDate,
      endDate,
      metrics,
      dimensions: "day",
      sort: "day",
    });

    // Process the response
    const response = {
      timeRange: {
        startDate,
        endDate,
      },
      columnHeaders: analyticsResponse.data.columnHeaders,
      rows: analyticsResponse.data.rows || [],
      totals: analyticsResponse.data.totals || [],
      queryInfo: {
        metrics: metrics.split(","),
        dimensions: ["day"],
      },
    };

    // Return analytics data
    return NextResponse.json(response);
  } catch (error) {
    console.error("YouTube API error:", error);

    // Handle specific API errors
    if (error.code === 401 || error.response?.status === 401) {
      return NextResponse.json(
        {
          error:
            "Authentication error. Your session may have expired. Please log in again.",
        },
        { status: 401 }
      );
    } else if (error.code === 403 || error.response?.status === 403) {
      return NextResponse.json(
        {
          error:
            "Permission denied. Your account may not have access to YouTube Analytics or you need to enable YouTube access.",
          details: error.response?.data?.error?.message || error.message,
        },
        { status: 403 }
      );
    } else if (error.response?.data?.error) {
      return NextResponse.json(
        {
          error: "YouTube API error",
          details: error.response.data.error.message,
          code: error.response.data.error.code,
        },
        { status: error.response.status || 500 }
      );
    }

    // General error response
    return NextResponse.json(
      {
        error: "Failed to fetch YouTube analytics data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
