// src/services/youtube.js
import axios from "axios";

export class YouTubeService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.useMockResponse = process.env.USE_MOCK_YOUTUBE_API === "true";
  }

  async verifyToken() {
    try {
      await axios.get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );
      return true;
    } catch (error) {
      if (this.isDevelopment && this.useMockResponse) {
        return true;
      }
      throw new Error("Invalid or expired token");
    }
  }

  async getUploadUrl(metadata) {
    const youtubeUploadUrl =
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

    const response = await axios.post(youtubeUploadUrl, metadata, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": "video/*",
      },
    });

    const uploadUrl = response.headers.location;
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL from YouTube API");
    }

    return uploadUrl;
  }

  async uploadVideo(uploadUrl, videoBuffer) {
    const response = await axios.put(uploadUrl, Buffer.from(videoBuffer), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "video/mp4",
        "Content-Length": videoBuffer.byteLength.toString(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 60000,
    });

    let videoId = null;

    if (response.data?.id) {
      videoId = response.data.id;
    } else if (response.headers.location) {
      try {
        videoId = new URL(response.headers.location).searchParams.get("id");
      } catch (e) {
        console.warn("Could not parse video ID from location header");
      }
    }

    if (!videoId) {
      throw new Error("Video was uploaded but ID could not be determined");
    }

    return videoId;
  }

  async fetchVideoData(videoUrl) {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download video: ${response.status} ${response.statusText}`
      );
    }
    return await response.arrayBuffer();
  }

  async uploadToYouTube(videoUrl, metadata) {
    if (this.isDevelopment && this.useMockResponse) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        success: true,
        videoId: "MOCK_VIDEO_" + Date.now().toString().slice(-6),
        message: "Mock video upload successful (development mode)",
      };
    }

    await this.verifyToken();

    const uploadUrl = await this.getUploadUrl(metadata);
    const videoBuffer = await this.fetchVideoData(videoUrl);
    const videoId = await this.uploadVideo(uploadUrl, videoBuffer);

    return {
      success: true,
      videoId,
      message: "Video successfully uploaded to YouTube",
    };
  }
}
