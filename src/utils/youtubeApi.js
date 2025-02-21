// src/utils/youtubeApi.js
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Initialize YouTube API client using Next Auth token
 * @param {string} accessToken - OAuth access token
 * @returns {object} - Authenticated YouTube API client
 */
export const getYouTubeClient = (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.youtube({
    version: "v3",
    auth,
  });
};

/**
 * Get a list of YouTube channels for the authenticated user
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Array>} - List of channels
 */
export const getUserChannels = async (accessToken) => {
  try {
    const youtube = getYouTubeClient(accessToken);

    const response = await youtube.channels.list({
      part: "snippet,statistics,contentDetails",
      mine: true,
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching YouTube channels:", error);
    throw new Error("Failed to fetch YouTube channels");
  }
};

/**
 * Upload a video to YouTube
 * @param {string} accessToken - OAuth access token
 * @param {object} videoData - Video metadata and file
 * @returns {Promise<object>} - Uploaded video information
 */
export const uploadVideo = async (accessToken, videoData) => {
  try {
    const {
      title,
      description,
      tags = [],
      categoryId = "22", // Default to "People & Blogs"
      privacyStatus = "public",
      videoFile,
    } = videoData;

    const youtube = getYouTubeClient(accessToken);

    // First create the video metadata
    const res = await youtube.videos.insert({
      part: "snippet,status",
      notifySubscribers: true,
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: videoFile,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error uploading to YouTube:", error);
    throw new Error("Failed to upload video to YouTube");
  }
};

/**
 * Get video categories available in the US
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Array>} - List of video categories
 */
export const getVideoCategories = async (accessToken) => {
  try {
    const youtube = getYouTubeClient(accessToken);

    const response = await youtube.videoCategories.list({
      part: "snippet",
      regionCode: "US",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching YouTube categories:", error);
    throw new Error("Failed to fetch video categories");
  }
};

/**
 * Set custom thumbnail for a video
 * @param {string} accessToken - OAuth access token
 * @param {string} videoId - YouTube video ID
 * @param {Buffer} thumbnailFile - Thumbnail image file buffer
 * @returns {Promise<object>} - Thumbnail information
 */
export const setThumbnail = async (accessToken, videoId, thumbnailFile) => {
  try {
    const youtube = getYouTubeClient(accessToken);

    const response = await youtube.thumbnails.set({
      videoId,
      media: {
        body: thumbnailFile,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error setting thumbnail:", error);
    throw new Error("Failed to set video thumbnail");
  }
};

/**
 * Get authentication status and user information
 * Used in server components to check auth status
 */
export const getAuthStatus = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    // Get basic YouTube channel info if authenticated
    if (session.accessToken) {
      const channels = await getUserChannels(session.accessToken);
      return {
        isAuthenticated: true,
        user: {
          ...session.user,
          channels: channels.map((channel) => ({
            id: channel.id,
            title: channel.snippet.title,
            thumbnailUrl: channel.snippet.thumbnails?.default?.url,
            subscriberCount: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
          })),
        },
      };
    }

    return {
      isAuthenticated: true,
      user: session.user,
    };
  } catch (error) {
    console.error("Auth status check error:", error);
    return {
      isAuthenticated: false,
      user: null,
      error: "Failed to verify authentication status",
    };
  }
};
