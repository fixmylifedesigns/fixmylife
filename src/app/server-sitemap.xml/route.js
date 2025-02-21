import { getServerSideSitemap } from "next-sitemap";

export async function GET() {
  // Fetch your dynamic routes data here, like blog posts
  // const posts = await fetchBlogPosts();

  // For now we'll use some sample data
  const posts = [
    {
      slug: "youtube-automation-guide",
      lastModified: new Date().toISOString(),
    },
    {
      slug: "tiktok-to-youtube-conversion-tips",
      lastModified: new Date().toISOString(),
    },
    {
      slug: "content-repurposing-strategy",
      lastModified: new Date().toISOString(),
    },
  ];

  // Generate entries for each dynamic route
  const fields = posts.map((post) => ({
    loc: `https://fixmylife.app/blog/${post.slug}`,
    lastmod: post.lastModified,
    changefreq: "weekly",
  }));

  // Return XML sitemap
  return getServerSideSitemap(fields);
}
