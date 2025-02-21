/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://fixmylife.app",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://fixmylife.app/server-sitemap.xml", // If you have dynamic routes to include
    ],
  },
  exclude: ["/admin/*", "/private/*"],
  changefreq: "weekly",
  priority: 0.7,
};
