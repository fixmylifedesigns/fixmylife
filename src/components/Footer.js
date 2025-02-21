// src/components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">FixMyLife</h2>
            <p className="text-gray-400 mb-4">
              Automate your YouTube posting workflow with our simple, reliable
              platform.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              {["twitter", "facebook", "instagram", "youtube"].map(
                (platform) => (
                  <a
                    key={platform}
                    href={`https://${platform}.com/fixmylife`}
                    className="text-gray-400 hover:text-white transition"
                    aria-label={platform}
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {platform === "twitter" && "𝕏"}
                      {platform === "facebook" && "f"}
                      {platform === "instagram" && "📷"}
                      {platform === "youtube" && "▶️"}
                    </div>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Dashboard", path: "/dashboard" },
                { name: "Schedule a Post", path: "/schedule" },
                { name: "Post Now", path: "/post-now" },
                { name: "Settings", path: "/settings" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
                { name: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} FixMyLife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
