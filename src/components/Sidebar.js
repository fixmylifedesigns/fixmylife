"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../lib/firebase"; // ✅ Import Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";

const navigationItems = [
  { name: "Dashboard", icon: "📊", path: "/dashboard" },
  { name: "Schedule a Post", icon: "📅", path: "/schedule" },
  { name: "Post Now", icon: "🚀", path: "/post-now" },
  { name: "Post Now Premium", icon: "🚀", path: "/post-now-premium" },
  { name: "Analytics", icon: "📈", path: "/analytics" },
  { name: "History", icon: "📜", path: "/history" },
  { name: "Settings", icon: "⚙️", path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter(); // ✅ For redirecting after logout

  useEffect(() => {
    // Handle screen resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Listen for Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // ✅ Redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Try again.");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="absolute top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`sticky top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 
          ${
            isMobile
              ? mobileMenuOpen
                ? "translate-x-0 w-64"
                : "-translate-x-full w-64"
              : collapsed
              ? "w-20"
              : "w-64"
          }
          shadow-xl z-40`}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {(!collapsed || (isMobile && mobileMenuOpen)) && (
            <h1 className="text-xl font-bold">FixMyLife</h1>
          )}
          {collapsed && !isMobile && (
            <span className="mx-auto text-xl">🛠️</span>
          )}

          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white transition rounded-full p-1"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? "➡️" : "⬅️"}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center ${
                      collapsed && !isMobile ? "justify-center" : "px-6"
                    } py-3 hover:bg-blue-700 transition ${
                      isActive ? "bg-blue-800" : ""
                    }`}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {(!collapsed || (isMobile && mobileMenuOpen)) && (
                      <span className="ml-4">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile & Logout Section */}
        <div
          className={`p-4 border-t border-gray-800 ${
            collapsed && !isMobile ? "text-center" : "flex items-center"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>👤</span>
            )}
          </div>

          {/* Show user info & logout button if not collapsed */}
          {(!collapsed || (isMobile && mobileMenuOpen)) && user && (
            <div className="ml-3">
              <p className="font-medium">{user.displayName || "User"}</p>
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-md transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
