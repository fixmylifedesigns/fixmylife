// src/app/post-now-premium/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import TikTokPreview from "@/components/TikTokPreview";

// Add these helper functions here
// Helper function to check if URL is from Instagram
const isInstagramUrl = (url) => {
  if (!url) return false;
  return url.includes("instagram") || url.includes("cdninstagram");
};

// Helper function to get proxied thumbnail URL
const getProxiedThumbnailUrl = (url) => {
  if (isInstagramUrl(url)) {
    // Use the proxy endpoint for Instagram thumbnails
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url; // Return original URL for non-Instagram thumbnails
};

// Helper function to extract images from the response
const extractImagesFromResponse = (response) => {
  const images = [];

  // If we have media items with type 'image'
  if (response.data?.originalResponse?.medias) {
    const imageMedias = response.data.originalResponse.medias.filter(
      (media) => media.type === "image" && media.url
    );

    if (imageMedias.length > 0) {
      images.push(
        ...imageMedias.map((media) => getProxiedThumbnailUrl(media.url))
      );
    }
  }

  // If there are sources and hasImages flag is true
  if (
    images.length === 0 &&
    response.data?.sources?.length > 0 &&
    response.data.hasImages
  ) {
    images.push(
      ...response.data.sources.map((url) => getProxiedThumbnailUrl(url))
    );
  }

  // If still no images but we have a source that appears to be an image URL
  if (
    images.length === 0 &&
    response.data?.source &&
    (response.data.source.includes(".jpg") ||
      response.data.source.includes(".jpeg") ||
      response.data.source.includes(".png"))
  ) {
    images.push(getProxiedThumbnailUrl(response.data.source));
  }

  // Last resort: use thumbnail if available
  if (images.length === 0 && response.data?.originalResponse?.thumbnail) {
    images.push(
      getProxiedThumbnailUrl(response.data.originalResponse.thumbnail)
    );
  }

  return images;
};

// Helper function to check if URL is a video
const isVideoUrl = (url) => {
  if (!url) return false;
  return (
    url.includes(".mp4") ||
    url.includes(".mov") ||
    url.includes("video_dashinit") ||
    (url.includes("video") && !url.endsWith(".jpg") && !url.endsWith(".png"))
  );
};

// Helper function to extract media items from the response
const extractMediaFromResponse = (response) => {
  const media = {
    videos: [],
    images: [],
    mixedItems: [], // Array of {type: 'video'|'image', url: string} objects
  };

  // First, check for media items in originalResponse.medias
  if (response.data?.originalResponse?.medias?.length > 0) {
    response.data.originalResponse.medias.forEach((item) => {
      if (item.type === "video" || isVideoUrl(item.url)) {
        media.videos.push(item.url);
        media.mixedItems.push({
          type: "video",
          url: item.url,
          thumbnail: item.thumbnail,
        });
      } else if (item.type === "image" && item.url) {
        const imageUrl = getProxiedThumbnailUrl(item.url);
        media.images.push(imageUrl);
        media.mixedItems.push({ type: "image", url: imageUrl });
      }
    });
  }

  // If mixedItems is still empty, check sources array
  if (media.mixedItems.length === 0 && response.data?.sources?.length > 0) {
    response.data.sources.forEach((url) => {
      if (isVideoUrl(url)) {
        media.videos.push(url);
        media.mixedItems.push({
          type: "video",
          url,
          thumbnail:
            response.data.originalResponse?.thumbnail ||
            response.data.fixmyLifeData?.thumbnail,
        });
      } else if (url) {
        const imageUrl = getProxiedThumbnailUrl(url);
        media.images.push(imageUrl);
        media.mixedItems.push({ type: "image", url: imageUrl });
      }
    });
  }

  console.log("Extracted media:", {
    videosCount: media.videos.length,
    imagesCount: media.images.length,
    mixedItemsCount: media.mixedItems.length,
  });

  return media;
};

const VideoCarousel = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
    setPlaying(true); // Auto-play when changing videos
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    setPlaying(true); // Auto-play when changing videos
  };

  useEffect(() => {
    // Reset video when changing index
    if (videoRef.current) {
      videoRef.current.load();
      if (playing) {
        videoRef.current.play().catch((err) => {
          console.log("Autoplay prevented:", err);
          setPlaying(false);
        });
      }
    }
  }, [currentIndex, playing]);

  return (
    <div className="relative">
      <div className="relative h-96 w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={videos[currentIndex]}
          className="h-full w-full object-contain"
          controls
          autoPlay={playing}
          loop
          playsInline
          onClick={() => setPlaying(!playing)}
        />
      </div>

      {videos.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={goToPrevious}
            className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {videos.length > 1
            ? `${currentIndex + 1} / ${videos.length}`
            : "Single Video"}
        </div>
      </div>
    </div>
  );
};

export default function PostNowPremiumPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [videoSource, setVideoSource] = useState(null);
  const [formData, setFormData] = useState({
    tiktokUrl: "",
    youtubeTitle: "",
    youtubeDescription: "",
    tags: "",
    visibility: "public",
    category: "22",
    thumbnail: null,
    tikTokThumbnailUrl: null,
  });
  const [videoSearched, setVideoSearched] = useState(false);
  const [isTikTokInputDisabled, setIsTikTokInputDisabled] = useState(false);
  const [useTikTokThumbnail, setUseTikTokThumbnail] = useState(true);
  const [tiktokAPIResponse, setTiktokAPIResponse] = useState(null);
  // Add a new media type
  const [mediaType, setMediaType] = useState(null); // 'video', 'image', 'videoCarousel', or 'mixedCarousel'
  const [mixedCarouselItems, setMixedCarouselItems] = useState([]); // For storing mixed media items
  const [mediaImages, setMediaImages] = useState([]); // For storing multiple images
  const [mediaVideos, setMediaVideos] = useState([]); // For storing multiple videos in a carousel

  const [isPosting, setIsPosting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

  // Check for development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setDevMode(true);
    }
  }, []);

  // Categories from YouTube
  const categories = [
    { id: 1, name: "Film & Animation" },
    { id: 2, name: "Autos & Vehicles" },
    { id: 10, name: "Music" },
    { id: 15, name: "Pets & Animals" },
    { id: 17, name: "Sports" },
    { id: 20, name: "Gaming" },
    { id: 22, name: "People & Blogs" },
    { id: 23, name: "Comedy" },
    { id: 24, name: "Entertainment" },
    { id: 25, name: "News & Politics" },
    { id: 26, name: "Howto & Style" },
    { id: 27, name: "Education" },
    { id: 28, name: "Science & Technology" },
  ];
  const MixedCarousel = ({ items }) => {
    const currentItem = items[currentIndex];
    const isCurrentVideo = currentItem.type === "video";

    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? items.length - 1 : prevIndex - 1
      );
      setPlaying(true); // Auto-play when changing to video
    };

    const goToNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
      setPlaying(true); // Auto-play when changing to video
    };

    useEffect(() => {
      // Reset video when changing index
      if (isCurrentVideo && videoRef.current) {
        videoRef.current.load();
        if (playing) {
          videoRef.current.play().catch((err) => {
            console.log("Autoplay prevented:", err);
            setPlaying(false);
          });
        }
      }
    }, [currentIndex, isCurrentVideo, playing]);

    const downloadItem = () => {
      if (!currentItem) return;

      // For proxied URLs, extract the original URL for download
      let downloadUrl = currentItem.url;
      if (downloadUrl.startsWith("/api/proxy-image?url=")) {
        downloadUrl = decodeURIComponent(
          downloadUrl.replace("/api/proxy-image?url=", "")
        );
      }

      // Create a temporary anchor to trigger download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `media-${currentIndex + 1}.${
        isCurrentVideo ? "mp4" : "jpg"
      }`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return (
      <div className="relative">
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-black">
          {isCurrentVideo ? (
            <video
              ref={videoRef}
              src={currentItem.url}
              className="h-full w-full object-contain"
              controls
              autoPlay={playing}
              loop
              playsInline
              onClick={() => setPlaying(!playing)}
            />
          ) : (
            <img
              src={currentItem.url}
              alt={`Image ${currentIndex + 1}`}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {items.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={goToPrevious}
              className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {items.length > 1 ? (
              <span>
                {currentIndex + 1} / {items.length}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {isCurrentVideo ? "Video" : "Image"}
                </span>
              </span>
            ) : (
              <span>{isCurrentVideo ? "Video" : "Image"}</span>
            )}
          </div>

          <button
            onClick={downloadItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download {isCurrentVideo ? "Video" : "Image"}
          </button>
        </div>
      </div>
    );
  };

  // Check authentication status
  useEffect(() => {
    // if (sessionStatus === "authenticated" && session) {
    //   setIsAuthenticated(true);
    // } else if (sessionStatus === "unauthenticated") {
    //   if (devMode) {
    //     // In development, still allow using the app without auth
    //     console.log("Development mode: proceeding without authentication");
    //     setIsAuthenticated(true);
    //   } else {
    //     setIsAuthenticated(false);
    //     router.push("/login?redirect=post-now");
    //   }
    // }
  }, [session, sessionStatus, router, devMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    const goToNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    const downloadImage = (url) => {
      // For proxied URLs, extract the original URL for download
      let downloadUrl = url;
      if (url.startsWith("/api/proxy-image?url=")) {
        downloadUrl = decodeURIComponent(
          url.replace("/api/proxy-image?url=", "")
        );
      }

      // Create a temporary anchor to trigger download
      const a = document.createElement("a");
      a.href = url; // Use the proxied URL for display
      a.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return (
      <div className="relative">
        <div className="relative h-96 w-full overflow-hidden rounded-lg">
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="h-full w-full object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={goToPrevious}
              className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center relative">
          <div className="text-sm text-gray-500">
            {images.length > 1
              ? `${currentIndex + 1} / ${images.length}`
              : "Single Image"}
          </div>
          <button
            onClick={() => downloadImage(images[currentIndex])}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download Image
          </button>
        </div>
      </div>
    );
  };

  const handleThumbnailChange = (e) => {
    // Handle file upload
    if (e.target.files && e.target.files[0]) {
      // When selecting a custom file, disable TikTok thumbnail
      setUseTikTokThumbnail(false);

      setFormData((prev) => ({
        ...prev,
        thumbnail: e.target.files[0],
        tikTokThumbnailUrl: null, // Clear any TikTok thumbnail URL
      }));
    }
  };

  const validateForm = () => {
    if (!devMode && !session) {
      setError("You must be logged in to post videos");
      return false;
    }

    if (!formData.tiktokUrl) {
      setError("TikTok URL is required");
      return false;
    }
    if (!formData.youtubeTitle) {
      setError("YouTube title is required");
      return false;
    }

    // Basic URL validation (skip in dev mode if needed)
    if (!devMode) {
      const urlRegex =
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlRegex.test(formData.tiktokUrl)) {
        setError("Please enter a valid URL");
        return false;
      }
    }

    return true;
  };

  const resetVideoSearch = () => {
    console.log("Resetting video search state");
    setVideoSearched(false);
    setVideoSource(null);
    setIsTikTokInputDisabled(false);
    setFormData({
      tiktokUrl: "",
      youtubeTitle: "",
      youtubeDescription: "",
      tags: "",
      visibility: "public",
      category: "22", // Default to "People & Blogs"
      thumbnail: null,
      tikTokThumbnailUrl: null,
    });
    // Clear any errors that might be present
    setError("");
  };

  // Update the fetchTikTokVideo function to use the new endpoint
  const fetchTikTokVideo = async () => {
    try {
      setUploadProgress(10);
      const response = await axios.post("/api/fetch-social-media", {
        url: formData.tiktokUrl,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.source) {
        throw new Error("No video source returned from the server");
      }

      // Success - set video source and update progress
      setVideoSource(response.data.source);
      setUploadProgress(40);
      return response.data.source;
    } catch (err) {
      console.error("Error fetching video:", err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Unknown error occurred";

      setError(`Failed to fetch video: ${errorMessage}`);
      setIsPosting(false);
      setCurrentStep(1);
      return null;
    }
  };

  const uploadToYouTube = async (videoUrl) => {
    try {
      setUploadProgress(60);

      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : ["Social Media", "YouTube Shorts"];

      // Get the original thumbnail URL if it's proxied
      let thumbnailUrl = formData.tikTokThumbnailUrl;
      if (thumbnailUrl && thumbnailUrl.startsWith("/api/proxy-image?url=")) {
        thumbnailUrl = decodeURIComponent(
          thumbnailUrl.replace("/api/proxy-image?url=", "")
        );
      }

      // Basic upload data without potentially circular references
      const uploadData = {
        videoUrl: videoUrl,
        accessToken: session.accessToken,
        thumbnailUrl: thumbnailUrl,
        metadata: {
          snippet: {
            title: formData.youtubeTitle,
            description:
              formData.youtubeDescription || "Uploaded via FixMyLifeco.com",
            tags: tagsArray,
            categoryId: formData.category || "22",
            defaultLanguage: "en",
          },
          status: {
            privacyStatus: formData.visibility,
            selfDeclaredMadeForKids: false,
          },
        },
      };

      // Show additional progress during upload
      setUploadProgress(70);

      const response = await axios.post("/api/upload-youtube", uploadData);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.videoId) {
        throw new Error("No video ID returned from YouTube");
      }

      // If we have a custom thumbnail file and a successful video upload,
      // we need to upload it separately
      if (
        !formData.tikTokThumbnailUrl &&
        formData.thumbnail &&
        response.data.videoId
      ) {
        try {
          setUploadProgress(85);

          // Create a FormData object for the file upload
          const thumbnailFormData = new FormData();
          thumbnailFormData.append("thumbnail", formData.thumbnail);
          thumbnailFormData.append("videoId", response.data.videoId);
          thumbnailFormData.append("accessToken", session.accessToken);

          await axios.post("/api/upload-youtube-thumbnail", thumbnailFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setUploadProgress(95);
        } catch (thumbnailError) {
          console.error("Error uploading thumbnail:", thumbnailError);
          // Continue even if thumbnail upload fails
        }
      }

      setUploadProgress(100);
      setUploadedVideoId(response.data.videoId);
      return response.data.videoId;
    } catch (err) {
      console.error("Error uploading to YouTube:", err);

      const errorDetails = err.response?.data?.details
        ? JSON.stringify(err.response.data.details)
        : "";

      const errorMessage =
        err.response?.data?.error || err.message || "YouTube upload failed";

      setError(
        `Failed to upload to YouTube: ${errorMessage} ${
          errorDetails ? `(${errorDetails})` : ""
        }`
      );
      setIsPosting(false);
      setCurrentStep(1);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsPosting(true);
    setCurrentStep(2);
    setUploadProgress(0);

    // Get the current video URL based on media type
    let currentVideoUrl;
    if (mediaType === "video") {
      currentVideoUrl = videoSource;
    } else if (
      mediaType === "mixedCarousel" &&
      mixedCarouselItems[currentIndex]?.type === "video"
    ) {
      currentVideoUrl = mixedCarouselItems[currentIndex].url;
    } else {
      setError("No video selected for upload");
      setIsPosting(false);
      setCurrentStep(1);
      return;
    }

    // Development mode check
    const useDemoMode = devMode && (!session || !session.accessToken);

    if (useDemoMode) {
      // Your existing demo mode code...
      return;
    }

    try {
      // Upload the current video URL to YouTube
      const videoId = await uploadToYouTube(currentVideoUrl);
      if (!videoId) {
        throw new Error("Failed to upload to YouTube");
      }

      // Complete process
      setCurrentStep(3);
      setIsCompleted(true);
      setIsPosting(false);
    } catch (err) {
      console.error("Error posting content:", err);
      setError(err.message || "An unexpected error occurred");
      setIsPosting(false);
      setCurrentStep(1);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${
                    currentStep === step
                      ? "bg-blue-600 text-white"
                      : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {step === 1
                  ? "Details"
                  : step === 2
                  ? "Processing"
                  : "Complete"}
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-5 right-5 flex">
            <div
              className={`h-1 flex-1 ${
                currentStep > 1 ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`h-1 flex-1 ${
                currentStep > 2 ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderFormStep = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div>
          <div className="space-y-6">
            {/* TikTok URL with integrated search/cancel - always at top */}
            <div>
              <label
                htmlFor="tiktokUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Social Media Video URL*
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    id="tiktokUrl"
                    name="tiktokUrl"
                    value={formData.tiktokUrl}
                    onChange={handleChange}
                    disabled={isTikTokInputDisabled}
                    placeholder="Enter URL from TikTok, Instagram, Facebook, Twitter, etc."
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      isTikTokInputDisabled ? "bg-gray-100" : ""
                    }`}
                    required
                  />
                </div>

                {!videoSearched ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const response = await axios.post(
                          "/api/fetch-social-media",
                          {
                            url: formData.tiktokUrl,
                          }
                        );

                        if (response.data.error) {
                          throw new Error(response.data.error);
                        }

                        // Save the API response
                        setTiktokAPIResponse(response);

                        // Extract all media (videos and images)
                        const extractedMedia =
                          extractMediaFromResponse(response);
                        console.log("Extracted media:", extractedMedia);

                        // Reset any previous media type selection
                        setMediaType(null);

                        // Determine content type - prioritize mixed content detection
                        if (
                          extractedMedia.videos.length > 0 &&
                          extractedMedia.images.length > 0
                        ) {
                          // Mixed content - both videos and images exist
                          console.log(
                            "Mixed carousel detected with videos and images"
                          );
                          setMediaType("mixedCarousel");
                          setMixedCarouselItems(extractedMedia.mixedItems);
                        } else if (extractedMedia.videos.length > 1) {
                          // Multiple videos
                          console.log("Video carousel detected");
                          setMediaType("videoCarousel");
                          setMediaVideos(extractedMedia.videos);
                        } else if (extractedMedia.videos.length === 1) {
                          // Single video
                          console.log("Single video detected");
                          setMediaType("video");
                          setVideoSource(extractedMedia.videos[0]);
                        } else if (extractedMedia.images.length > 0) {
                          // Images only
                          console.log("Image content detected");
                          setMediaType("image");
                          setMediaImages(extractedMedia.images);
                        } else {
                          // Fallback to original approach
                          console.log("Using fallback detection method");
                          const images = extractImagesFromResponse(response);

                          if (images.length > 0) {
                            setMediaType("image");
                            setMediaImages(images);
                          } else if (response.data.source) {
                            setMediaType("video");
                            setVideoSource(response.data.source);
                          } else {
                            throw new Error(
                              "No video or images found in the content"
                            );
                          }
                        }

                        // Auto-populate form fields if data is available
                        if (response.data.fixmyLifeData) {
                          const recommendedData = response.data.fixmyLifeData;

                          setFormData((prev) => ({
                            ...prev,
                            youtubeTitle:
                              recommendedData.title || prev.youtubeTitle,
                            youtubeDescription:
                              recommendedData.description ||
                              prev.youtubeDescription,
                            tags: recommendedData.tags || prev.tags,
                          }));

                          // Default to using thumbnail if available and this is a video
                          if (
                            recommendedData.thumbnail &&
                            mediaType === "video"
                          ) {
                            setUseTikTokThumbnail(true);
                            setFormData((prev) => ({
                              ...prev,
                              tikTokThumbnailUrl: getProxiedThumbnailUrl(
                                recommendedData.thumbnail
                              ),
                            }));
                          }
                        }

                        // Update states to show form
                        setVideoSearched(true);
                        setIsTikTokInputDisabled(true);
                      } catch (err) {
                        console.error("Error previewing content:", err);
                        setError(`Failed to preview content: ${err.message}`);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || !formData.tiktokUrl}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                      isLoading || !formData.tiktokUrl
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
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
                        Loading...
                      </span>
                    ) : (
                      "Search Video"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetVideoSearch}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    Cancel Search
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Paste the full URL of any supported platform video you want to
                post
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Premium Feature
              </h3>
              <p className="text-xs text-blue-600">
                Post from TikTok, Instagram, Facebook, Twitter, YouTube,
                Pinterest, Reddit and 30+ other platforms
              </p>
            </div>

            {videoSearched && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Left column - Content Preview */}
                <div className="md:col-span-1">
                  {mediaType === "video" ? (
                    <TikTokPreview
                      tiktokUrl={formData.tiktokUrl}
                      videoSource={videoSource}
                      className="sticky top-4"
                      thumbnail={formData.thumbnail}
                    />
                  ) : mediaType === "videoCarousel" ? (
                    <VideoCarousel videos={mediaVideos} />
                  ) : mediaType === "mixedCarousel" ? (
                    <MixedCarousel items={mixedCarouselItems} />
                  ) : mediaType === "image" && mediaImages.length > 0 ? (
                    <ImageCarousel images={mediaImages} />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">No preview available</p>
                    </div>
                  )}
                </div>

                {/* Right column - Form fields for video or download options for images */}
                {mediaType === "video" ||
                (mediaType === "mixedCarousel" &&
                  mixedCarouselItems[currentIndex]?.type === "video") ? (
                  <form
                    onSubmit={handleSubmit}
                    className="md:col-span-1 space-y-6"
                  >
                    {/* YouTube Title */}
                    <div>
                      <label
                        htmlFor="youtubeTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        YouTube Title*
                      </label>
                      <input
                        type="text"
                        id="youtubeTitle"
                        name="youtubeTitle"
                        value={formData.youtubeTitle}
                        onChange={handleChange}
                        placeholder="Enter an engaging title for your YouTube video"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        maxLength={100}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.youtubeTitle.length}/100 characters used
                      </p>
                    </div>
                    {/* YouTube Description */}
                    <div>
                      <label
                        htmlFor="youtubeDescription"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        YouTube Description
                      </label>
                      <textarea
                        id="youtubeDescription"
                        name="youtubeDescription"
                        value={formData.youtubeDescription}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe your video and add relevant links..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {/* Tags */}
                    <div>
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="productivity, lifestyle, tips (comma separated)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {/* Visibility & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="visibility"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Visibility
                        </label>
                        <select
                          id="visibility"
                          name="visibility"
                          value={formData.visibility}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="unlisted">Unlisted</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Custom Thumbnail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail
                      </label>

                      {tiktokAPIResponse?.data?.fixmyLifeData?.thumbnail && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="useTikTokThumbnail"
                              checked={useTikTokThumbnail}
                              onChange={(e) => {
                                setUseTikTokThumbnail(e.target.checked);
                                if (e.target.checked) {
                                  // Store TikTok thumbnail URL instead of file
                                  setFormData((prev) => ({
                                    ...prev,
                                    tikTokThumbnailUrl: getProxiedThumbnailUrl(
                                      tiktokAPIResponse.data.fixmyLifeData
                                        .thumbnail
                                    ),
                                    thumbnail: null,
                                  }));
                                } else {
                                  // Clear TikTok thumbnail URL
                                  setFormData((prev) => ({
                                    ...prev,
                                    tikTokThumbnailUrl: null,
                                  }));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="useTikTokThumbnail"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Use platform thumbnail
                            </label>
                          </div>

                          {useTikTokThumbnail && (
                            <div className="relative w-44 h-60 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={getProxiedThumbnailUrl(
                                  tiktokAPIResponse.data.fixmyLifeData.thumbnail
                                )}
                                alt="Platform thumbnail"
                                className="h-full object-cover m-auto"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {!useTikTokThumbnail && (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="thumbnail"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="thumbnail"
                                  name="thumbnail"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleThumbnailChange}
                                  disabled={useTikTokThumbnail}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 2MB
                            </p>
                            {formData.thumbnail && (
                              <p className="text-xs text-green-600">
                                Selected: {formData.thumbnail.name}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions - Always at the bottom */}
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => router.push("/dashboard")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isPosting || !isAuthenticated || !videoSearched
                        }
                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                          isPosting || !isAuthenticated || !videoSearched
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Post Now
                      </button>
                    </div>
                  </form>
                ) : mediaType === "mixedCarousel" &&
                  mixedCarouselItems[currentIndex]?.type === "image" ? (
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-3">
                        Multi-Media Content Detected
                      </h3>
                      <p className="text-blue-700 mb-4">
                        This post contains multiple{" "}
                        {mediaType === "mixedCarousel"
                          ? "media items (videos and images)"
                          : "videos"}
                        . You can browse and download individual items using the
                        carousel controls.
                      </p>

                      {mediaType === "videoCarousel" && (
                        <div className="mt-4 border-t border-blue-200 pt-4">
                          <p className="text-blue-700 mb-4">
                            To upload a specific video to YouTube, please copy
                            its direct link and paste it in a new search.
                          </p>
                          <button
                            type="button"
                            onClick={resetVideoSearch}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Search Another Post
                          </button>
                        </div>
                      )}

                      <h4 className="font-medium text-blue-800 mt-6 mb-2">
                        Content Details
                      </h4>
                      <dl className="space-y-2">
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Title:</dt>
                          <dd className="col-span-2 text-sm">
                            {tiktokAPIResponse?.data?.fixmyLifeData?.title ||
                              tiktokAPIResponse?.data?.originalResponse
                                ?.title ||
                              "Not available"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Platform:</dt>
                          <dd className="col-span-2 text-sm capitalize">
                            {tiktokAPIResponse?.data?.platform || "Unknown"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Author:</dt>
                          <dd className="col-span-2 text-sm">
                            {tiktokAPIResponse?.data?.originalResponse
                              ?.author ||
                              tiktokAPIResponse?.data?.platformData?.author
                                ?.name ||
                              "Unknown"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Items:</dt>
                          <dd className="col-span-2 text-sm">
                            {mediaType === "mixedCarousel"
                              ? `${mixedCarouselItems.length} (Mixed content)`
                              : `${mediaVideos.length} videos`}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ) : mediaType === "image" ? (
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-3">
                        Image Content Detected
                      </h3>
                      <p className="text-blue-700 mb-4">
                        We&apos;ve detected that this content contains images
                        rather than video. You can view and download the images,
                        but posting to YouTube is only supported for video
                        content.
                      </p>

                      <h4 className="font-medium text-blue-800 mt-6 mb-2">
                        Content Details
                      </h4>
                      <dl className="space-y-2">
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Title:</dt>
                          <dd className="col-span-2 text-sm">
                            {tiktokAPIResponse?.data?.fixmyLifeData?.title ||
                              tiktokAPIResponse?.data?.originalResponse
                                ?.title ||
                              "Not available"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Platform:</dt>
                          <dd className="col-span-2 text-sm capitalize">
                            {tiktokAPIResponse?.data?.platform || "Unknown"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Author:</dt>
                          <dd className="col-span-2 text-sm">
                            {tiktokAPIResponse?.data?.originalResponse
                              ?.author ||
                              tiktokAPIResponse?.data?.platformData?.author
                                ?.name ||
                              "Unknown"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-3">
                          <dt className="text-blue-600 text-sm">Images:</dt>
                          <dd className="col-span-2 text-sm">
                            {mediaImages.length}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={resetVideoSearch}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Search Another Post
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  const renderProcessingStep = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
            🔄
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Processing Your Content</h3>
        <p className="text-gray-600 mb-8">
          We&apos;re downloading your video, processing it, and uploading to
          YouTube. This may take a few minutes.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{uploadProgress}% Complete</p>

        {/* Processing steps */}
        <div className="mt-8 text-left space-y-3">
          <div className="flex items-center">
            <span
              className={`w-6 h-6 rounded-full ${
                uploadProgress > 20
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex items-center justify-center text-xs mr-3`}
            >
              {uploadProgress > 20 ? "✓" : "1"}
            </span>
            <span
              className={
                uploadProgress > 20 ? "text-green-600" : "text-gray-600"
              }
            >
              Downloading video from source platform
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`w-6 h-6 rounded-full ${
                uploadProgress > 50
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex items-center justify-center text-xs mr-3`}
            >
              {uploadProgress > 50 ? "✓" : "2"}
            </span>
            <span
              className={
                uploadProgress > 50 ? "text-green-600" : "text-gray-600"
              }
            >
              Processing and optimizing
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`w-6 h-6 rounded-full ${
                uploadProgress > 80
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex items-center justify-center text-xs mr-3`}
            >
              {uploadProgress > 80 ? "✓" : "3"}
            </span>
            <span
              className={
                uploadProgress > 80 ? "text-green-600" : "text-gray-600"
              }
            >
              Uploading to YouTube
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`w-6 h-6 rounded-full ${
                uploadProgress === 100
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex items-center justify-center text-xs mr-3`}
            >
              {uploadProgress === 100 ? "✓" : "4"}
            </span>
            <span
              className={
                uploadProgress === 100 ? "text-green-600" : "text-gray-600"
              }
            >
              Finalizing
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">
            ✓
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Posted Successfully!</h3>
        <p className="text-gray-600 mb-8">
          Your content has been successfully posted to YouTube. It may take a
          few minutes to appear publicly.
        </p>

        {/* Video details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <h4 className="font-medium mb-2">Video Details</h4>
          <dl className="space-y-2">
            <div className="grid grid-cols-3">
              <dt className="text-gray-500 text-sm">Title:</dt>
              <dd className="col-span-2 text-sm">{formData.youtubeTitle}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-gray-500 text-sm">Visibility:</dt>
              <dd className="col-span-2 text-sm capitalize">
                {formData.visibility}
              </dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-gray-500 text-sm">YouTube Link:</dt>
              <dd className="col-span-2 text-sm">
                {uploadedVideoId ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${uploadedVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on YouTube →
                  </a>
                ) : (
                  <span className="text-gray-500">Processing...</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => {
              setFormData({
                tiktokUrl: "",
                youtubeTitle: "",
                youtubeDescription: "",
                tags: "",
                visibility: "public",
                category: "22",
                thumbnail: null,
                tikTokThumbnailUrl: null,
              });
              setCurrentStep(1);
              setIsCompleted(false);
              setUploadedVideoId("");
              setVideoSource(null);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Post Another Video
          </button>
        </div>
      </div>
    </div>
  );

  // Show a loading state while checking authentication
  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Post Now Premium
            </h1>
            <p className="text-gray-600 mt-2">
              Instantly convert and publish content from multiple platforms to
              YouTube
            </p>
          </header>
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          {/* Step indicator */}
          {renderStepIndicator()}
          {/* Content based on current step */}
          {currentStep === 1 && renderFormStep()}
          {currentStep === 2 && renderProcessingStep()}
          {currentStep === 3 && renderCompletionStep()}
        </div>
      </main>
    </div>
  );
}
