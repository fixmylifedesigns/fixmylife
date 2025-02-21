"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    tiktokUrl: "",
    youtubeTitle: "",
    youtubeDescription: "",
    scheduledDate: "",
    scheduledTime: "",
    tags: "",
    visibility: "public",
    category: "22",
    thumbnail: null,
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    // Handle file upload
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: e.target.files[0],
      }));
    }
  };

  const validateForm = () => {
    if (!formData.tiktokUrl) {
      setStatus({ ...status, error: "TikTok URL is required" });
      return false;
    }
    if (!formData.youtubeTitle) {
      setStatus({ ...status, error: "YouTube title is required" });
      return false;
    }
    if (!formData.scheduledDate || !formData.scheduledTime) {
      setStatus({ ...status, error: "Scheduled date and time are required" });
      return false;
    }

    // Basic URL validation for TikTok
    const tiktokRegex =
      /^https:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.*$/i;
    if (!tiktokRegex.test(formData.tiktokUrl)) {
      setStatus({ ...status, error: "Please enter a valid TikTok URL" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    if (!validateForm()) {
      setStatus((prev) => ({ ...prev, submitting: false }));
      return;
    }

    try {
      // Convert form data to URL encoded format
      const submissionData = {
        scheduleDate: formData.scheduledDate,
        scheduleTime: formData.scheduledTime,
        tiktokUrl: formData.tiktokUrl,
        youtubeTitle: formData.youtubeTitle,
        youtubeDescription: formData.youtubeDescription,
        youtubeTags: formData.tags,
        categoryId: formData.category || "22",
        privacyStatus: formData.visibility,
      };

      const formBody = new URLSearchParams();
      Object.keys(submissionData).forEach((key) => {
        formBody.append(key, submissionData[key]);
      });

      // Send data to Google Apps Script API
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxOhiBi1HOQH-hlb5ptOYs25QCwztmMHwUOv_obpNqJ5V8CYYeY-X3w-Y3g4uBhbSCB/exec",
        {
          method: "POST",
          mode: "no-cors", // Prevent CORS issues
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString(),
        }
      );

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
      });

      // Reset form after submission
      setFormData({
        tiktokUrl: "",
        youtubeTitle: "",
        youtubeDescription: "",
        scheduledDate: "",
        scheduledTime: "",
        tags: "",
        visibility: "public",
        category: "22",
        thumbnail: null,
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus({
        submitting: false,
        submitted: false,
        error: "❌ Failed to submit form. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Schedule a Post
            </h1>
            <p className="text-gray-600 mt-2">
              Convert your TikTok content to YouTube and schedule it for later
            </p>
          </header>

          {/* Success message */}
          {status.submitted && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Post scheduled successfully! It will be published at the
                    specified time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {status.error && (
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
                  <p className="text-sm text-red-800">{status.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* TikTok URL */}
                  <div>
                    <label
                      htmlFor="tiktokUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      TikTok Video URL*
                    </label>
                    <input
                      type="text"
                      id="tiktokUrl"
                      name="tiktokUrl"
                      value={formData.tiktokUrl}
                      onChange={handleChange}
                      placeholder="https://www.tiktok.com/@username/video/1234567890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Paste the full URL of the TikTok video you want to
                      repurpose
                    </p>
                  </div>

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
                      rows={4}
                      placeholder="Describe your video and add relevant links..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Add keywords, hashtags, and calls to action
                    </p>
                  </div>

                  {/* Scheduling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="scheduledDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date*
                      </label>
                      <input
                        type="date"
                        id="scheduledDate"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="scheduledTime"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Time*
                      </label>
                      <input
                        type="time"
                        id="scheduledTime"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
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
                        <option value="">Select a category</option>
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
                      Custom Thumbnail (Optional)
                    </label>
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
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                        status.submitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {status.submitting ? (
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
                          Scheduling...
                        </span>
                      ) : (
                        "Schedule Post"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
