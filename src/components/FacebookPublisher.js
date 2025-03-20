"use client";
// src/components/FacebookPublisher.js
import { useState, useEffect } from "react";
import {
  FacebookApiClient,
  parseAccessTokenFromHash,
} from "@/utils/facebookApi";

export default function FacebookPublisher({
  videoUrl,
  videoTitle,
  videoDescription,
}) {
  const [fbAccessToken, setFbAccessToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userPages, setUserPages] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("me");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [error, setError] = useState(null);
  const [privacySetting, setPrivacySetting] = useState("EVERYONE");

  // Facebook App ID - should be stored in environment variables
  const FB_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  // Check if we have a token in localStorage or URL hash on mount
  useEffect(() => {
    // Check for token in localStorage
    const savedToken = localStorage.getItem("fb_access_token");

    if (savedToken) {
      setFbAccessToken(savedToken);
      setIsConnected(true);
      fetchUserPages(savedToken);
    } else {
      // Check if there's a token in the URL (after Facebook redirect)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const parsed = parseAccessTokenFromHash(hash);
        if (parsed?.accessToken) {
          setFbAccessToken(parsed.accessToken);
          setIsConnected(true);
          localStorage.setItem("fb_access_token", parsed.accessToken);
          fetchUserPages(parsed.accessToken);

          // Clear the hash from the URL
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
        }
      }
    }
  }, []);

  // Fetch user's Facebook pages when connected
  const fetchUserPages = async (token) => {
    try {
      const fbClient = new FacebookApiClient(token);

      // Check if we have the necessary permissions
      const permissionCheck = await fbClient.checkPermissions([
        "publish_video",
      ]);

      if (!permissionCheck.hasAllPermissions) {
        setError(
          `Missing required Facebook permissions: ${permissionCheck.missingPermissions.join(
            ", "
          )}`
        );
        return;
      }

      // Get user profile
      const profile = await fbClient.getUserProfile();

      // Get pages
      const pages = await fbClient.getUserPages();

      setUserPages([
        { id: "me", name: `Your Timeline (${profile.name})` },
        ...pages.map((page) => ({ id: page.id, name: page.name })),
      ]);
    } catch (err) {
      console.error("Error fetching Facebook pages:", err);
      setError(
        "Failed to fetch Facebook pages. Please reconnect your account."
      );
      setIsConnected(false);
      localStorage.removeItem("fb_access_token");
    }
  };

  // Connect to Facebook
  const connectToFacebook = () => {
    if (!FB_APP_ID) {
      setError("Facebook App ID is not configured.");
      return;
    }

    const redirectUri = window.location.href.split("#")[0]; // Current URL without hash
    const loginUrl = FacebookApiClient.getLoginUrl(FB_APP_ID, redirectUri, [
      "public_profile",
      "publish_video",
      "pages_manage_posts",
    ]);

    window.location.href = loginUrl;
  };

  // Disconnect from Facebook
  const disconnectFacebook = () => {
    setFbAccessToken(null);
    setIsConnected(false);
    setUserPages([]);
    localStorage.removeItem("fb_access_token");
  };

  // Publish video to Facebook
  const publishToFacebook = async () => {
    if (!videoUrl) {
      setError("No video URL provided");
      return;
    }

    if (!fbAccessToken) {
      setError("Not connected to Facebook");
      return;
    }

    setIsPublishing(true);
    setError(null);
    setPublishResult(null);

    try {
      // Prepare request data with the same structure as YouTube
      const requestData = {
        facebookAccessToken: fbAccessToken,
        videoUrl: videoUrl,
        title: videoTitle || "Video from FixMyLife",
        description: videoDescription || "",
        targetId: selectedTarget,
        privacy: privacySetting,
      };

      console.log(`Publishing to Facebook: ${selectedTarget}`, {
        url: videoUrl,
        title: requestData.title.substring(0, 30) + "...",
      });

      // Make API call
      const response = await fetch("/api/publish-facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include", // Include cookies for session
      });

      // Get response as text first for debugging
      const responseText = await response.text();
      console.log(`Facebook API Response (${response.status}):`, responseText);

      // Try to parse as JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        throw new Error(
          `Invalid server response: ${responseText.substring(0, 100)}...`
        );
      }

      // Check for errors
      if (!response.ok) {
        throw new Error(
          data.error || data.message || `Server error: ${response.status}`
        );
      }

      console.log("Facebook publish success:", data);
      setPublishResult(data);
    } catch (err) {
      console.error("Error publishing to Facebook:", err);
      setError(`Failed to publish video to Facebook: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Publish to Facebook</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {publishResult && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          <p>Video successfully published to Facebook!</p>
          {publishResult.url && (
            <p className="mt-2">
              <a
                href={publishResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on Facebook
              </a>
            </p>
          )}
        </div>
      )}

      {!isConnected ? (
        <div className="text-center py-4">
          <button
            onClick={connectToFacebook}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Connect Facebook Account
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Connect your Facebook account to publish videos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Connected to Facebook
            </span>
            <button
              onClick={disconnectFacebook}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Disconnect
            </button>
          </div>

          {/* Target selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish to
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {userPages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Setting
            </label>
            <select
              value={privacySetting}
              onChange={(e) => setPrivacySetting(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="EVERYONE">Public</option>
              <option value="FRIENDS">Friends</option>
              <option value="ONLY_ME">Only Me</option>
            </select>
          </div>

          {/* Video preview and details */}
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="text-sm text-gray-700">
              <p>
                <strong>Video URL:</strong>{" "}
                {videoUrl
                  ? videoUrl.substring(0, 50) + "..."
                  : "No video selected"}
              </p>
              <p>
                <strong>Title:</strong> {videoTitle || "No title"}
              </p>
              {videoDescription && (
                <p>
                  <strong>Description:</strong>{" "}
                  {videoDescription.substring(0, 100)}...
                </p>
              )}
            </div>
          </div>

          {/* Publish button */}
          <button
            onClick={publishToFacebook}
            disabled={isPublishing || !videoUrl}
            className={`w-full px-4 py-2 text-white rounded-md ${
              isPublishing || !videoUrl
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPublishing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </span>
            ) : (
              "Publish to Facebook"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
