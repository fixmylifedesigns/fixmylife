// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FixMyLife - Automate Your YouTube Posting",
  description:
    "Automate your YouTube posting workflow with FixMyLife. Schedule posts, convert TikTok to YouTube, and focus on creating content.",
  keywords: [
    "youtube automation",
    "content scheduling",
    "social media tools",
    "tiktok to youtube",
  ],
  openGraph: {
    title: "FixMyLife - Automate Your YouTube Posting",
    description: "Automate your YouTube posting workflow with FixMyLife",
    url: "https://fixmylifeco.com",
    siteName: "FixMyLife",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixMyLife - Automate Your YouTube Posting",
    description: "Automate your YouTube posting workflow with FixMyLife",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="">
              {/* Sidebar will only show on authenticated pages */}
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
