"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";
// import ChannelPerformance from "@/components/dashboard/ChannelPerformanceChart";
import RecentActivity from "@/components/dasboard/RecentActivity";
import AnalyticsCards from "@/components/dasboard/AnalyticsCards";

import Link from "next/link";

export default function Dashboard() {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    completedPosts: 0,
    viewsThisMonth: 0,
    growthRate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTimeframe, setActiveTimeframe] = useState("week");

  // Fetch data from Google Sheets
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        // Google Sheets API endpoint
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxOhiBi1HOQH-hlb5ptOYs25QCwztmMHwUOv_obpNqJ5V8CYYeY-X3w-Y3g4uBhbSCB/exec"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheets");
        }

        const data = await response.json();

        // Validate response
        if (!Array.isArray(data) || data.length < 2) {
          throw new Error("Invalid data format received from API");
        }

        // Process the posts data
        const formattedPosts = processPostsData(data.slice(1));

        // Calculate analytics
        const analyticsData = calculateAnalytics(data.slice(1));

        setScheduledPosts(formattedPosts);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load scheduled posts");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to process posts data
  function processPostsData(posts) {
    return posts
      .map((post, index) => ({
        id: index + 1,
        title: post[6] || "Untitled Video", // YouTube Title
        tiktokUrl: post[5] || "#", // TikTok URL
        scheduledFor: formatScheduledDateTimeString(post[1], post[2]), // Combine date and time
        status: post[3] === "Yes" ? "posted" : "scheduled",
        youtubeLink: post[4] || null,
        description: post[7] || "", // YouTube Description
        thumbnail: `/placeholders/video${(index % 4) + 1}.jpg`, // Placeholder thumbnails
      }))
      .filter((post) => post.status === "scheduled") // Only show scheduled posts
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor)); // Sort by scheduled date
  }

  // Function to calculate analytics
  function calculateAnalytics(posts) {
    const totalPosts = posts.length;
    const postedPosts = posts.filter((post) => post[3] === "Yes").length;
    const pendingPosts = totalPosts - postedPosts;

    return {
      totalPosts: totalPosts,
      scheduledPosts: pendingPosts,
      completedPosts: postedPosts,
      viewsThisMonth: calculateEstimatedViews(postedPosts),
      growthRate: calculateGrowthRate(postedPosts),
    };
  }

  // Safe function to format scheduled date and time
  function formatScheduledDateTimeString(dateString, timeString) {
    if (!dateString) return new Date().toISOString();

    try {
      const date = new Date(dateString);

      // If no valid time, return just the date at noon
      if (!timeString) {
        date.setHours(12, 0, 0, 0);
        return date.toISOString();
      }

      // Try to extract hours and minutes
      const timeParts = timeString.split(" ")[0].split(":");
      let hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1] || 0);

      // Check if AM/PM is present
      const ampmPart = timeString.split(" ")[1];
      if (ampmPart) {
        const ampm = ampmPart.toLowerCase();
        // Convert to 24-hour format
        if (ampm === "pm" && hours < 12) {
          hours += 12;
        } else if (ampm === "am" && hours === 12) {
          hours = 0;
        }
      }

      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return new Date().toISOString();
    }
  }

  // Helper function to estimate views based on posted videos
  function calculateEstimatedViews(postedCount) {
    // Simple algorithm: each post gets an average of 2000-3000 views
    const averageViewsPerPost = Math.floor(Math.random() * 1000) + 2000;
    return postedCount * averageViewsPerPost;
  }

  // Helper function to calculate growth rate
  function calculateGrowthRate(postedCount) {
    if (postedCount < 5) return "+5.2%";
    if (postedCount < 10) return "+8.7%";
    if (postedCount < 20) return "+12.3%";
    return "+15.8%";
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back! Here&apos;s what&apos;s happening with your
                  YouTube content.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/schedule">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition">
                    Create New Post
                  </button>
                </Link>
              </div>
            </div>
          </header>

          {/* Analytics Cards */}
          {/* <AnalyticsCards loading={loading} analytics={analytics} /> */}

          {/* Performance Chart */}
          {/* <ChannelPerformance /> */}

          {/* Quick Actions & Upcoming Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Link
                  href="/schedule"
                  className="flex items-center p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition"
                >
                  <div className="p-2 bg-indigo-100 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-indigo-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule New Post</h3>
                    <p className="text-sm text-gray-600">
                      Plan your content calendar
                    </p>
                  </div>
                </Link>

                <Link
                  href="/post-now"
                  className="flex items-center p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition"
                >
                  <div className="p-2 bg-green-100 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-green-600"
                    >
                      <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Post Now</h3>
                    <p className="text-sm text-gray-600">
                      Publish content immediately
                    </p>
                  </div>
                </Link>

                {/* <Link
                  href="/analytics"
                  className="flex items-center p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition"
                >
                  <div className="p-2 bg-blue-100 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-600"
                    >
                      <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">View Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Track content performance
                    </p>
                  </div>
                </Link> */}
              </div>
            </div>

            {/* Upcoming Scheduled Posts */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upcoming Scheduled Posts
                  </h2>
                  <Link href="/schedule">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                      View All
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 ml-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>

              {loading ? (
                // Skeleton loaders for posts
                <div className="animate-pulse">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex p-4 border-b border-gray-100"
                      >
                        <div className="w-24 h-16 bg-gray-200 rounded mr-4"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 h-8 text-red-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Error loading data
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : scheduledPosts.length > 0 ? (
                scheduledPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`flex p-5 hover:bg-gray-50 transition ${
                      index !== scheduledPosts.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-gray-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                        Source: {post.tiktokUrl}
                      </p>
                      <div className="flex items-center">
                        <span className="inline-flex items-center text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3 mr-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDate(post.scheduledFor)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        className="text-gray-400 hover:text-indigo-600 p-1 rounded transition"
                        aria-label="Edit post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition ml-2"
                        aria-label="Delete post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 h-8 text-indigo-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 5V3.75C6 2.784 6.784 2 7.75 2h4.5c.966 0 1.75.784 1.75 1.75V5h4A2 2 0 0119 7v9a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h3zm4 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm-4.5 2.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm8.25-5.5h-7.5V3.75a.25.25 0 01.25-.25h7a.25.25 0 01.25.25V5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No scheduled posts
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Start scheduling your YouTube content to build a consistent
                    posting calendar.
                  </p>
                  <Link href="/schedule">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition shadow-sm">
                      Schedule Your First Post
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          {/* <RecentActivity
            loading={loading}
            analytics={analytics}
            scheduledPosts={scheduledPosts}
          /> */}
        </div>
      </main>
    </div>
  );
}
