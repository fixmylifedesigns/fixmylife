// src/utils/facebookApi.js
import axios from "axios";

/**
 * Helper class for interacting with the Facebook Graph API
 */
export class FacebookApiClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = "https://graph.facebook.com/v18.0";
  }

  /**
   * Get user's Facebook profile information
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken,
          fields: "id,name,picture",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Facebook profile:", error);
      throw new Error("Failed to fetch Facebook profile");
    }
  }

  /**
   * Get list of pages managed by the user
   * @returns {Promise<Array>} List of pages
   */
  async getUserPages() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: this.accessToken,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching Facebook pages:", error);
      throw new Error("Failed to fetch Facebook pages");
    }
  }

  /**
   * Check if access token has specific permissions
   * @param {Array} requiredPermissions - List of permission names to check
   * @returns {Promise<Object>} Object with hasAllPermissions flag and missing permissions list
   */
  async checkPermissions(requiredPermissions) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/permissions`, {
        params: {
          access_token: this.accessToken,
        },
      });

      const grantedPermissions = new Set(
        response.data.data
          .filter((perm) => perm.status === "granted")
          .map((perm) => perm.permission)
      );

      const missingPermissions = requiredPermissions.filter(
        (perm) => !grantedPermissions.has(perm)
      );

      return {
        hasAllPermissions: missingPermissions.length === 0,
        missingPermissions: missingPermissions,
        grantedPermissions: Array.from(grantedPermissions),
      };
    } catch (error) {
      console.error("Error checking Facebook permissions:", error);
      throw new Error("Failed to check Facebook permissions");
    }
  }

  /**
   * Publish a video to Facebook
   * @param {Object} videoData Video data and metadata
   * @param {string} videoData.videoUrl URL of the video to publish
   * @param {string} videoData.title Video title
   * @param {string} videoData.description Video description
   * @param {string} videoData.targetId Page ID or user ID (defaults to user timeline)
   * @param {string} videoData.privacy Privacy setting (EVERYONE, FRIENDS, ONLY_ME)
   * @returns {Promise<Object>} Published video information
   */
  async publishVideo(videoData) {
    try {
      // Call our API endpoint to handle the multi-step upload process
      const response = await axios.post("/api/publish-facebook", {
        facebookAccessToken: this.accessToken,
        videoUrl: videoData.videoUrl,
        title: videoData.title || "",
        description: videoData.description || "",
        targetId: videoData.targetId || null,
        privacy: videoData.privacy || "EVERYONE",
      });

      return response.data;
    } catch (error) {
      console.error("Error publishing video to Facebook:", error);
      throw new Error(
        error.response?.data?.error || "Failed to publish video to Facebook"
      );
    }
  }

  /**
   * Get a list of videos published by the user or page
   * @param {string} targetId Page ID or user ID (defaults to user's own videos)
   * @returns {Promise<Array>} List of videos
   */
  async getVideos(targetId = "me") {
    try {
      const response = await axios.get(`${this.baseUrl}/${targetId}/videos`, {
        params: {
          access_token: this.accessToken,
          fields:
            "id,title,description,source,permalink_url,thumbnail_url,created_time",
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching Facebook videos:", error);
      throw new Error("Failed to fetch Facebook videos");
    }
  }

  /**
   * Generate a login URL for Facebook OAuth authentication
   * @param {string} redirectUri Redirect URI after authentication
   * @param {Array} permissions List of permissions to request
   * @returns {string} Facebook login URL
   */
  static getLoginUrl(
    appId,
    redirectUri,
    permissions = ["public_profile", "publish_video"]
  ) {
    const baseUrl = "https://www.facebook.com/v18.0/dialog/oauth";
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: permissions.join(","),
    });

    return `${baseUrl}?${params.toString()}`;
  }
}

/**
 * Parse Facebook access token from URL hash fragment
 * @param {string} urlHash URL hash fragment (#access_token=...)
 * @returns {Object} Parsed token information
 */
export function parseAccessTokenFromHash(urlHash) {
  if (!urlHash || !urlHash.startsWith("#")) return null;

  const params = new URLSearchParams(urlHash.substring(1));

  return {
    accessToken: params.get("access_token"),
    expiresIn: params.get("expires_in"),
    tokenType: params.get("token_type"),
  };
}
