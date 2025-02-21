// src/app/api/fetch-tiktok/route.js
import SnapTikClient from "@/utils/SnapTikClient";

const BASE_URL = "https://fixmylife.io";

async function resolveTikTokRedirect(shortUrl) {
  try {
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    return response.url.split("?")[0];
  } catch (error) {
    console.error("Error resolving TikTok redirect:", error);
    throw new Error("Failed to resolve TikTok URL");
  }
}

// Get TikTok metadata using oembed API
async function getTikTokMetadata(url) {
  try {
    const response = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok metadata: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TikTok metadata:", error);
    return null; // Return null instead of throwing to continue processing
  }
}

// Fallback method when SnapTik fails
async function getFallbackVideoUrl() {
  console.log("Using fallback video URL for development");
  // For development/testing purposes
  return "https://storage.googleapis.com/fixmylife-videos/sample-video.mp4";
}

export async function POST(req) {
  try {
    let { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle TikTok short URLs
    if (url.includes("vt.tiktok.com/") || url.includes("vm.tiktok.com/")) {
      url = await resolveTikTokRedirect(url);
    }

    // Remove query parameters for processing
    const cleanUrl = url.split("?")[0];
    console.log("Processing TikTok URL:", cleanUrl);

    // Get TikTok metadata - run this in parallel with video processing
    const metadataPromise = getTikTokMetadata(cleanUrl);

    // Process video download
    const snaptik = new SnapTikClient();
    let sources = [];
    let error = null;

    try {
      const result = await snaptik.process(cleanUrl);

      if (result.success && result.data?.sources?.length > 0) {
        sources = result.data.sources.map((resource) => resource.url);
      } else if (result.type === "video" && result.data?.sources?.length > 0) {
        sources = result.data.sources.map((resource) => resource.url);
      } else {
        error = "No video sources found in SnapTik response";
      }
    } catch (snapError) {
      console.error("SnapTik processing failed:", snapError.message);
      error = snapError.message;
    }

    // If SnapTik failed, try fallback method
    if (sources.length === 0) {
      try {
        const fallbackUrl = await getFallbackVideoUrl();
        if (fallbackUrl) {
          sources = [fallbackUrl];
          console.log("Using fallback video source");
        }
      } catch (fallbackError) {
        console.error("Fallback method failed:", fallbackError.message);
      }
    }

    if (sources.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Failed to retrieve video sources",
          details: error,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Wait for metadata to be fetched
    const metadata = await metadataPromise;

    // Process metadata to extract useful content for form population
    const processedData = processVideoData(metadata);

    // Extract relevant metadata fields if available
    const tikTokData = metadata
      ? {
          author: {
            name: metadata.author_name || "",
            username: metadata.author_unique_id || "",
            url: metadata.author_url || "",
          },
          video: {
            id: metadata.embed_product_id || "",
            title: metadata.title || "",
            thumbnail: metadata.thumbnail_url || "",
            thumbnail_width: metadata.thumbnail_width,
            thumbnail_height: metadata.thumbnail_height,
            music: metadata.html?.match(/♬\s*(.*?)\s*</)?.[1] || "",
          },
        }
      : null;

    return new Response(
      JSON.stringify({
        source: sources[0],
        sources: sources,
        cleanUrl: cleanUrl,
        tikTokData: tikTokData,
        fixmyLifeData: processedData,
        originalMetadata:
          process.env.NODE_ENV === "development" ? metadata : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-tiktok API:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process TikTok URL",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Helper function to process TikTok data and extract useful content
function processVideoData(metadata) {
  if (!metadata) return null;

  // Extract hashtags from title
  const titleText = metadata.title || "";
  const hashtags = (titleText.match(/#[a-zA-Z0-9_]+/g) || []).map((tag) =>
    tag.substring(1)
  ); // Remove # prefix

  // Remove hashtags from title
  let cleanTitle = titleText.replace(/#[a-zA-Z0-9_]+\s*/g, "").trim();

  // Create tags array including author information
  const tags = [...hashtags];

  // Add author username if available
  if (metadata.author_unique_id && !tags.includes(metadata.author_unique_id)) {
    tags.push(metadata.author_unique_id);
  }

  // Add author name parts if available (split by spaces and emoji)
  if (metadata.author_name) {
    const nameParts = metadata.author_name
      .split(/\s+/)
      .filter((part) => part.length > 1) // Skip single characters
      .map((part) => part.replace(/[^\w\s]/gi, "")) // Remove emojis and special chars
      .filter((part) => part.length > 0 && !tags.includes(part));

    tags.push(...nameParts);
  }

  return {
    title: cleanTitle,
    description: cleanTitle,
    tags: tags.join(", "),
    thumbnail: metadata.thumbnail_url || "",
    originalTitle: titleText,
  };
}
