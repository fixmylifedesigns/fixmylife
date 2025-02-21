// src/utils/sheetsApi.js

/**
 * Fetch scheduled posts from the API
 * @returns {Promise<Array>} Array of scheduled posts
 */
export const getScheduledPosts = async () => {
  try {
    const response = await fetch("/api/sheets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch scheduled posts");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    throw error;
  }
};

/**
 * Schedule a new post
 * @param {Object} postData - The post data to schedule
 * @returns {Promise<Object>} The response from the API
 */
export const schedulePost = async (postData) => {
  try {
    const response = await fetch("/api/sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to schedule post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error scheduling post:", error);
    throw error;
  }
};

/**
 * Delete a scheduled post
 * @param {string} id - The post ID to delete
 * @returns {Promise<Object>} The response from the API
 */
export const deleteScheduledPost = async (id) => {
  try {
    const response = await fetch(`/api/sheets?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

/**
 * Update a scheduled post
 * @param {string} id - The post ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The response from the API
 */
export const updateScheduledPost = async (id, updateData) => {
  try {
    const response = await fetch("/api/sheets", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...updateData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

/**
 * Format scheduled posts for display
 * @param {Array} posts - Raw posts from the API
 * @returns {Array} Formatted posts for UI display
 */
export const formatScheduledPosts = (posts) => {
  return posts.map((post) => {
    // Convert timestamps to Date objects if needed
    const scheduledDate = new Date(post.scheduledFor);

    return {
      ...post,
      formattedDate: scheduledDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      formattedTime: scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isScheduled: post.status === "scheduled",
      isPending: scheduledDate > new Date(),
    };
  });
};

/**
 * Get analytics data from scheduled posts
 * @param {Array} posts - Scheduled posts
 * @returns {Object} Analytics data
 */
export const getAnalyticsFromPosts = (posts) => {
  const now = new Date();

  const completed = posts.filter((post) => post.status === "completed").length;
  const pending = posts.filter(
    (post) => post.status === "scheduled" && new Date(post.scheduledFor) > now
  ).length;
  const failed = posts.filter((post) => post.status === "failed").length;
  const total = posts.length;

  // Group posts by month
  const postsByMonth = posts.reduce((acc, post) => {
    const date = new Date(post.scheduledFor);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }

    acc[monthYear]++;
    return acc;
  }, {});

  // Convert to array for charting
  const monthlyPostCounts = Object.entries(postsByMonth).map(
    ([month, count]) => ({
      month,
      count,
    })
  );

  return {
    completed,
    pending,
    failed,
    total,
    monthlyPostCounts,
  };
};
