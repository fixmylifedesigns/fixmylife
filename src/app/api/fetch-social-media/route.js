// src/app/api/fetch-social-media/route.js
export async function POST(req) {
  const data = {
    source:
      "https://instagram.fhan5-11.fna.fbcdn.net/o1/v/t16/f2/m367/AQOtIq3apTaWbli0jOkHd0GAGEY4DHZvhnHxbOVSsvUW3ZUvNy3yCIfST8M_E1xznA-xyAlt5npvqXtU4Ai7qk6uoladsmdf5LFFQZQ.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2Fyb3VzZWxfaXRlbS5jMi4xMDgwLmJhc2VsaW5lIn0&_nc_cat=100&vs=1145200283993449_863079816&_nc_vs=HBksFQIYQGlnX2VwaGVtZXJhbC9EQTQ2MUYwMTk3N0FCMTVDMTg0QUFBRUM0ODVERkJCRF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dHczlxaHpoRVBxQzc3SURBR3g5SmcxTV8tQXpia1lMQUFBRhUCAsgBACgAGAAbABUAACaM9eW0quCPQBUCKAJDMywXQEy0m6XjU%2FgYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHXuBwA%3D&ccb=9-4&oh=00_AYAYRfa60r9ezW-5_VnD957aBHTZZ5bJo0EYDh-yDOsyZA&oe=67B9531E&_nc_sid=10d13b",
    sources: [
      "https://instagram.fhan5-11.fna.fbcdn.net/o1/v/t16/f2/m367/AQOtIq3apTaWbli0jOkHd0GAGEY4DHZvhnHxbOVSsvUW3ZUvNy3yCIfST8M_E1xznA-xyAlt5npvqXtU4Ai7qk6uoladsmdf5LFFQZQ.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2Fyb3VzZWxfaXRlbS5jMi4xMDgwLmJhc2VsaW5lIn0&_nc_cat=100&vs=1145200283993449_863079816&_nc_vs=HBksFQIYQGlnX2VwaGVtZXJhbC9EQTQ2MUYwMTk3N0FCMTVDMTg0QUFBRUM0ODVERkJCRF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dHczlxaHpoRVBxQzc3SURBR3g5SmcxTV8tQXpia1lMQUFBRhUCAsgBACgAGAAbABUAACaM9eW0quCPQBUCKAJDMywXQEy0m6XjU%2FgYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHXuBwA%3D&ccb=9-4&oh=00_AYAYRfa60r9ezW-5_VnD957aBHTZZ5bJo0EYDh-yDOsyZA&oe=67B9531E&_nc_sid=10d13b",
      "https://instagram.fhan5-10.fna.fbcdn.net/o1/v/t16/f2/m367/AQMX21TYbaRyxWUsXbkKzepwT-kX728yEuvpFHVEZhr21T6FIF4Ww_LQRmY_DPZOzKtthviTQMg2wsQmxTBtE_Fe7MH7SuZm8c49OpM.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2Fyb3VzZWxfaXRlbS5jMi4xMDgwLmJhc2VsaW5lIn0&_nc_cat=101&vs=598617313007553_1100971543&_nc_vs=HBksFQIYQGlnX2VwaGVtZXJhbC9BQzRFQUI0MjVDRjBCRkFDRjU0OTZCRjUxNjMxNTk5NV92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dGcE1weHhlZmhRUVhUc0RBRnhzUHdvd3N0ZF9ia1lMQUFBRhUCAsgBACgAGAAbABUAACbM8ZDxt%2FO3PxUCKAJDMywXQCBEGJN0vGoYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHXuBwA%3D&ccb=9-4&oh=00_AYC-m0PvCXbipKbDApR22TcSXFvm4GZridXtZnNYgJYDLw&oe=67B962B2&_nc_sid=10d13b",
      "https://instagram.fhan5-11.fna.fbcdn.net/o1/v/t16/f2/m367/AQPyfF2dyd2_ApavRfkrAMmy5PiyMpCO8iVViGIdXocxk6zwRe_mCCg1BtYV9l0idXLioIUb7SIm1DvptTaIoD_c4TMa1kSnIrUP-n0.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2Fyb3VzZWxfaXRlbS5jMi4xMDgwLmJhc2VsaW5lIn0&_nc_cat=103&vs=4044969379120173_4292218021&_nc_vs=HBksFQIYQGlnX2VwaGVtZXJhbC80NDREQTI4RTk3RUQ5MzEwQ0IyQkNCNzAwM0M1RERBQl92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dINllueHg2dFNESHpHVUZBQUZlVVJCVFM5ZzZia1lMQUFBRhUCAsgBACgAGAAbABUAACaCr%2BmTwr3HPxUCKAJDMywXQDbu2RaHKwIYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHXuBwA%3D&ccb=9-4&oh=00_AYBlbZI4-R-qKmP1xqvDnG9u0iq76X9yoX9F3uymulhrhA&oe=67B936CD&_nc_sid=10d13b",
    ],
    cleanUrl: "https://www.instagram.com/p/DGTMfqST8QK/",
    platformData: {
      author: {
        name: "🫧🪸🐢🦖(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾わかめマッスル(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾🦖🐢🪸🫧",
        username: "p",
        url: "https://www.instagram.com/p",
      },
      video: {
        id: "DGTMfqST8QK",
        title:
          "2/20ありがとうございまっする💪\n\nビンタ、写真、キック、お神輿、お姫様、サンドイッチ、ドリンク、生搾り\nありがとうございマッスル💪\n\n今日は104キロお姫様抱っこさせてもらいました！！！！\n\nフォーキーいつもドリンクありがとう🩷\n\nなぴ動画とってくれてありがとう🩷",
        thumbnail:
          "https://instagram.fhan5-8.fna.fbcdn.net/v/t51.2885-15/481361601_17944730462949968_4540694571781879378_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fhan5-8.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2AE--btDRy93wSOqRpXpJfbxeJaGVNWBXJGNWp-YwY_OvZrAK-Jz4OiXs634Z4mEe1E&_nc_ohc=72cAagqqO2QQ7kNvgHdaKGk&_nc_gid=c7cb99eedc1e450990d75193ab9efc0d&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYAaGgfn87aT-m2omGeWHpCohl8FBvC34NGG6RxAj4iJlQ&oe=67BD33EE&_nc_sid=10d13b",
        duration: "",
      },
    },
    fixmyLifeData: {
      title:
        "2/20ありがとうございまっする💪 ビンタ、写真、キック、お神輿、お姫様、サンドイッチ、ドリンク、生搾り\nありがとうございマッスル💪 今日は104キロお姫様抱っこさせてもらいました！！！！ フォーキーいつもドリンクありがとう🩷 なぴ動画とってくれてありがとう🩷",
      description:
        "2/20ありがとうございまっする💪 ビンタ、写真、キック、お神輿、お姫様、サンドイッチ、ドリンク、生搾り\nありがとうございマッスル💪 今日は104キロお姫様抱っこさせてもらいました！！！！ フォーキーいつもドリンクありがとう🩷 なぴ動画とってくれてありがとう🩷\n\nOriginal content by 🫧🪸🐢🦖(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾わかめマッスル(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾🦖🐢🪸🫧",
      tags: "🫧🪸🐢🦖(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾わかめマッスル(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾🦖🐢🪸🫧, instagram, shorts, viral, trending",
      thumbnail:
        "https://instagram.fhan5-8.fna.fbcdn.net/v/t51.2885-15/481361601_17944730462949968_4540694571781879378_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fhan5-8.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2AE--btDRy93wSOqRpXpJfbxeJaGVNWBXJGNWp-YwY_OvZrAK-Jz4OiXs634Z4mEe1E&_nc_ohc=72cAagqqO2QQ7kNvgHdaKGk&_nc_gid=c7cb99eedc1e450990d75193ab9efc0d&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYAaGgfn87aT-m2omGeWHpCohl8FBvC34NGG6RxAj4iJlQ&oe=67BD33EE&_nc_sid=10d13b",
      originalTitle:
        "2/20ありがとうございまっする💪\n\nビンタ、写真、キック、お神輿、お姫様、サンドイッチ、ドリンク、生搾り\nありがとうございマッスル💪\n\n今日は104キロお姫様抱っこさせてもらいました！！！！\n\nフォーキーいつもドリンクありがとう🩷\n\nなぴ動画とってくれてありがとう🩷",
    },
    originalResponse: {
      url: "https://www.instagram.com/p/DGTMfqST8QK/?utm_source=ig_web_copy_link&img_index=10",
      source: "instagram",
      title:
        "2/20ありがとうございまっする💪\n\nビンタ、写真、キック、お神輿、お姫様、サンドイッチ、ドリンク、生搾り\nありがとうございマッスル💪\n\n今日は104キロお姫様抱っこさせてもらいました！！！！\n\nフォーキーいつもドリンクありがとう🩷\n\nなぴ動画とってくれてありがとう🩷",
      author: "🫧🪸🐢🦖(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾わかめマッスル(⸅᷇˾ͨ⸅᷆ ⁾˗̡⁾🦖🐢🪸🫧",
      shortcode: "DGTMfqST8QK",
      thumbnail:
        "https://instagram.fhan5-8.fna.fbcdn.net/v/t51.2885-15/481361601_17944730462949968_4540694571781879378_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fhan5-8.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2AE--btDRy93wSOqRpXpJfbxeJaGVNWBXJGNWp-YwY_OvZrAK-Jz4OiXs634Z4mEe1E&_nc_ohc=72cAagqqO2QQ7kNvgHdaKGk&_nc_gid=c7cb99eedc1e450990d75193ab9efc0d&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYAaGgfn87aT-m2omGeWHpCohl8FBvC34NGG6RxAj4iJlQ&oe=67BD33EE&_nc_sid=10d13b",
      medias: [
        {
          id: "3572252448020914174",
          url: "https://instagram.fhan5-11.fna.fbcdn.net/o1/v/t16/f2/m367/AQPyfF2dyd2_ApavRfkrAMmy5PiyMpCO8iVViGIdXocxk6zwRe_mCCg1BtYV9l0idXLioIUb7SIm1DvptTaIoD_c4TMa1kSnIrUP-n0.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2Fyb3VzZWxfaXRlbS5jMi4xMDgwLmJhc2VsaW5lIn0&_nc_cat=103&vs=4044969379120173_4292218021&_nc_vs=HBksFQIYQGlnX2VwaGVtZXJhbC80NDREQTI4RTk3RUQ5MzEwQ0IyQkNCNzAwM0M1RERBQl92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dINllueHg2dFNESHpHVUZBQUZlVVJCVFM5ZzZia1lMQUFBRhUCAsgBACgAGAAbABUAACaCr%2BmTwr3HPxUCKAJDMywXQDbu2RaHKwIYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHXuBwA%3D&ccb=9-4&oh=00_AYBlbZI4-R-qKmP1xqvDnG9u0iq76X9yoX9F3uymulhrhA&oe=67B936CD&_nc_sid=10d13b",
          thumbnail:
            "https://instagram.fhan5-8.fna.fbcdn.net/v/t51.2885-15/480662979_17944730453949968_7764182138709528671_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fhan5-8.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2AE--btDRy93wSOqRpXpJfbxeJaGVNWBXJGNWp-YwY_OvZrAK-Jz4OiXs634Z4mEe1E&_nc_ohc=qxv7e5pyD9UQ7kNvgG0EGPg&_nc_gid=c7cb99eedc1e450990d75193ab9efc0d&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYBRLbsFQyb-V9iq8Z5Y36cU2hquZn686i3SmG5rNHYjfw&oe=67BD4A31&_nc_sid=10d13b",
          quality: "750-937p",
          type: "video",
          extension: "mp4",
        },
        {
          id: "3572253867532665287",
          url: "https://instagram.fhan5-8.fna.fbcdn.net/v/t51.2885-15/481007123_17944730402949968_6393287550015128350_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fhan5-8.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2AE--btDRy93wSOqRpXpJfbxeJaGVNWBXJGNWp-YwY_OvZrAK-Jz4OiXs634Z4mEe1E&_nc_ohc=PT_M0AbDe_kQ7kNvgFZxgyi&_nc_gid=c7cb99eedc1e450990d75193ab9efc0d&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYBhJLmDsIe0Hw-9KHx8pqxnaepfFZQ1GNqpZBejZgP4gA&oe=67BD30FC&_nc_sid=10d13b",
          quality: "1080-1350p",
          type: "image",
          extension: "jpg",
        },
      ],
      type: "multiple",
      error: false,
      time_end: 1413,
    },
    platform: "instagram",
    mediasCount: 10,
    hasAudio: false,
    hasImages: true,
  };
  console.log(JSON.stringify(data));
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  try {
    let { url, cookie = null } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Processing social media URL:", url);

    // Prepare request payload
    const requestPayload = cookie ? { url, cookie } : { url };

    const response = await fetch(
      "https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "auto-download-all-in-one.p.rapidapi.com",
        },
        body: JSON.stringify(requestPayload),
      }
    );

    const result = await response.json();
    console.log("RapidAPI Response:", result);

    if (result.error) {
      throw new Error(`Failed to fetch content: ${result.error}`);
    }

    // Get the video source from the medias array (prefer mp4 videos)
    const videoSource = getPreferredVideoSource(result.medias);
    const videoSources = result.medias
      .filter((media) => media.type === "video")
      .map((media) => media.url);

    // Transform the result to match the format expected by the post-now page
    const transformedResponse = {
      // Primary video source
      source: videoSource || result.source || result.url || "",

      // All available video sources
      sources:
        videoSources.length > 0 ? videoSources : [videoSource].filter(Boolean),

      // Original URL without query parameters
      cleanUrl: url.split("?")[0],

      // Platform-specific metadata (similar to tikTokData)
      platformData: {
        author: {
          name: result.author || "",
          username: extractUsername(result.author, url),
          url: getPlatformAuthorUrl(url, extractUsername(result.author, url)),
        },
        video: {
          id: extractVideoId(url),
          title: result.title || "",
          thumbnail: result.thumbnail || "",
          duration: result.duration || "",
        },
      },

      // Data prepared for form auto-population
      fixmyLifeData: {
        title: cleanupTitle(result.title || ""),
        description: generateDescription(
          result.title || "",
          result.author || ""
        ),
        tags: generateTags(
          result.title || "",
          result.author || "",
          detectPlatform(url)
        ),
        thumbnail: result.thumbnail || "",
        originalTitle: result.title || "",
      },

      // Only include raw response in development
      originalResponse:
        process.env.NODE_ENV === "development" ? result : undefined,

      // Add platform information
      platform: detectPlatform(url),

      // Additional metadata that might be useful
      mediasCount: result.medias?.length || 0,
      hasAudio: result.medias?.some((m) => m.type === "audio") || false,
      hasImages: result.medias?.some((m) => m.type === "image") || false,
    };

    return new Response(JSON.stringify(transformedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-social-media API:", error.message);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process URL",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to get the best video source
function getPreferredVideoSource(medias = []) {
  if (!medias || !medias.length) return null;

  // First priority: MP4 videos with highest quality
  const mp4Videos = medias
    .filter((media) => media.type === "video" && media.extension === "mp4")
    .sort((a, b) => {
      // If quality contains numbers, compare them
      const aQuality = parseInt(a.quality?.match(/\d+/)?.[0] || 0);
      const bQuality = parseInt(b.quality?.match(/\d+/)?.[0] || 0);
      return bQuality - aQuality;
    });

  if (mp4Videos.length > 0) {
    return mp4Videos[0].url;
  }

  // Second priority: Any video
  const anyVideo = medias.find((media) => media.type === "video");
  if (anyVideo) {
    return anyVideo.url;
  }

  // Fallback: Any media
  return medias[0]?.url || null;
}

// Helper to clean up title by removing hashtags and excess spaces
function cleanupTitle(title) {
  return title
    .replace(/#[a-zA-Z0-9_]+\s*/g, "") // Remove hashtags
    .replace(/\s{2,}/g, " ") // Remove extra spaces
    .trim();
}

// Generate a good description based on title and author
function generateDescription(title, author) {
  const cleanTitle = cleanupTitle(title);
  if (author) {
    return `${cleanTitle}\n\nOriginal content by ${author}`;
  }
  return cleanTitle;
}

// Extract username from author string or URL
function extractUsername(author, url) {
  if (!author && !url) return "";

  // If author contains @, extract username
  if (author && author.includes("@")) {
    return author.split("@")[1].trim();
  }

  // Try to extract from URL based on platform
  const platform = detectPlatform(url);
  const urlObj = new URL(url);

  switch (platform) {
    case "tiktok":
      return url.match(/@([^\/]+)/)?.[1] || "";
    case "instagram":
      return urlObj.pathname.split("/")[1] || "";
    case "twitter":
      return urlObj.pathname.split("/")[1] || "";
    default:
      // Basic fallback: try to get something usable from the author string
      return author ? author.replace(/[^\w]/g, "").toLowerCase() : "";
  }
}

// Generate platform-specific author URL
function getPlatformAuthorUrl(sourceUrl, username) {
  if (!username) return "";

  const platform = detectPlatform(sourceUrl);
  switch (platform) {
    case "tiktok":
      return `https://www.tiktok.com/@${username}`;
    case "instagram":
      return `https://www.instagram.com/${username}`;
    case "twitter":
      return `https://twitter.com/${username}`;
    case "youtube":
      return `https://www.youtube.com/@${username}`;
    default:
      return "";
  }
}

// Extract video ID from URL
function extractVideoId(url) {
  const platform = detectPlatform(url);

  try {
    switch (platform) {
      case "youtube":
        return (
          new URL(url).searchParams.get("v") ||
          url.split("youtu.be/")[1]?.split("?")[0] ||
          ""
        );
      case "tiktok":
        return url.match(/video\/(\d+)/)?.[1] || "";
      case "instagram":
        return (
          url.split("/p/")[1]?.split("/")[0] ||
          url.split("/reel/")[1]?.split("/")[0] ||
          ""
        );
      default:
        // Generate a pseudo-ID from the URL
        return url.split("/").pop() || "";
    }
  } catch (e) {
    return "";
  }
}

// Generate relevant tags based on content and platform
function generateTags(title, author, platform) {
  const tags = [];

  // Extract hashtags from title
  const hashtags = (title.match(/#[a-zA-Z0-9_]+/g) || []).map((tag) =>
    tag.substring(1)
  );
  tags.push(...hashtags);

  // Add cleaned author name as tag if available
  if (author) {
    const cleanAuthor = author.replace("@", "").trim();
    if (cleanAuthor && !tags.includes(cleanAuthor)) {
      tags.push(cleanAuthor);
    }
  }

  // Add platform-specific tags
  if (platform && !tags.includes(platform)) {
    tags.push(platform);
  }

  // Add common video tags
  const commonTags = ["shorts", "viral", "trending"];
  commonTags.forEach((tag) => {
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  });

  return tags.join(", ");
}

// Helper function to detect platform from URL
function detectPlatform(url) {
  if (!url) return "unknown";

  const lowercaseUrl = url.toLowerCase();

  if (
    lowercaseUrl.includes("tiktok.com") ||
    lowercaseUrl.includes("vm.tiktok")
  ) {
    return "tiktok";
  } else if (lowercaseUrl.includes("douyin.com")) {
    return "douyin";
  } else if (lowercaseUrl.includes("instagram.com")) {
    return "instagram";
  } else if (
    lowercaseUrl.includes("youtube.com") ||
    lowercaseUrl.includes("youtu.be")
  ) {
    return "youtube";
  } else if (
    lowercaseUrl.includes("facebook.com") ||
    lowercaseUrl.includes("fb.com")
  ) {
    return "facebook";
  } else if (
    lowercaseUrl.includes("twitter.com") ||
    lowercaseUrl.includes("x.com")
  ) {
    return "twitter";
  } else if (lowercaseUrl.includes("pinterest.com")) {
    return "pinterest";
  } else if (lowercaseUrl.includes("reddit.com")) {
    return "reddit";
  } else if (lowercaseUrl.includes("vimeo.com")) {
    return "vimeo";
  } else if (lowercaseUrl.includes("snapchat.com")) {
    return "snapchat";
  } else if (lowercaseUrl.includes("linkedin.com")) {
    return "linkedin";
  } else if (lowercaseUrl.includes("xiaohongshu.com")) {
    return "xiaohongshu";
  }

  return "unknown";
}
