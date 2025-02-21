// src/app/sitemap.js
export default function sitemap() {
  const baseUrl = "https://fixmylife.app";

  // Main pages
  const routes = [
    "",
    "/login",
    "/signup",
    "/dashboard",
    "/schedule",
    "/post-now",
    "/settings",
    "/blog",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Blog posts could be dynamically generated in a full implementation
  // For now, we'll add some sample blog posts
  const blogPosts = [
    "/blog/youtube-automation-guide",
    "/blog/tiktok-to-youtube-conversion-tips",
    "/blog/content-repurposing-strategy",
    "/blog/social-media-scheduling-best-practices",
  ].map((post) => ({
    url: `${baseUrl}${post}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...blogPosts];
}
