// src/services/facebook.js
import axios from "axios";

export class FacebookService {
  /**
   * Initialize Facebook service with access token
   * @param {string} accessToken - Facebook access token with publish_video permissions
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = "https://graph.facebook.com/v18.0";
  }

  /**
   * Upload video to Facebook
   * @param {string} videoUrl - URL of the video to upload
   * @param {object} metadata - Video metadata (title, description, etc)
   * @returns {Promise<object>} - Upload result with video ID and success status
   */
  async uploadToFacebook(videoUrl, metadata = {}) {
    try {
      console.log("Preparing to upload video to Facebook:", videoUrl);

      const {
        title = "",
        description = "",
        targetId = "me",
        privacy = "EVERYONE",
      } = metadata;

      // Direct upload using file_url parameter
      const uploadUrl = `${this.baseUrl}/${targetId}/videos`;
      const formData = new URLSearchParams();
      formData.append("access_token", this.accessToken);
      formData.append("file_url", videoUrl);
      formData.append("title", title);
      formData.append("description", description);

      // Set privacy if provided
      if (privacy) {
        formData.append("privacy", JSON.stringify({ value: privacy }));
      }

      console.log("Sending request to Facebook API:", uploadUrl);

      const response = await axios.post(uploadUrl, formData);

      if (!response.data || !response.data.id) {
        throw new Error(
          "Invalid response from Facebook API (missing video ID)"
        );
      }

      const videoId = response.data.id;
      console.log("Video published successfully to Facebook with ID:", videoId);

      return {
        success: true,
        videoId,
        url: `https://facebook.com/${videoId}`,
        message: "Video successfully published to Facebook",
      };
    } catch (error) {
      console.error("Facebook upload error:", error.response?.data || error);

      // Format error message based on Facebook API response format
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      const errorCode = error.response?.data?.error?.code;
      const errorType = error.response?.data?.error?.type;

      // If direct URL upload fails, we could add a fallback to chunked upload here

      throw {
        message: `Facebook upload failed: ${errorMessage}`,
        code: errorCode,
        type: errorType,
        response: error.response?.data,
        original: error,
      };
    }
  }

  /**
   * Verify if the access token has the required permissions
   * @returns {Promise<boolean>} - Whether token has required permissions
   */
  async verifyPermissions() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/permissions`, {
        params: { access_token: this.accessToken },
      });

      const permissions = response.data.data || [];
      const hasPublishVideo = permissions.some(
        (p) => p.permission === "publish_video" && p.status === "granted"
      );

      return hasPublishVideo;
    } catch (error) {
      console.error("Error verifying Facebook permissions:", error);
      return false;
    }
  }

  /**
   * Get basic information about the authenticated user
   * @returns {Promise<object>} - User profile data
   */
  async getUserInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken,
          fields: "id,name,picture",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Facebook user info:", error);
      throw new Error("Failed to fetch Facebook user information");
    }
  }

  /**
   * Get pages managed by the user
   * @returns {Promise<Array>} - List of managed pages
   */
  async getUserPages() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: { access_token: this.accessToken },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching Facebook pages:", error);
      return [];
    }
  }
}
