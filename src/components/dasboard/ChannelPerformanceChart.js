"use client";
import { useState, useEffect } from "react";

export default function ChannelPerformance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState("week");

  useEffect(() => {
    fetchChannelPerformance(activeTimeframe);
  }, [activeTimeframe]);

  const fetchChannelPerformance = async (timeframe) => {
    setLoading(true);
    try {
      // Calculate date ranges based on timeframe
      const endDate = new Date();
      let startDate = new Date();

      switch (timeframe) {
        case "week":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Format dates for API
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      // Call your backend API that handles YouTube API authentication
      const response = await fetch(
        `/api/youtube/analytics?startDate=${formattedStartDate}&endDate=${formattedEndDate}&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      processApiResponse(data, timeframe);
    } catch (err) {
      console.error("Error fetching YouTube analytics:", err);
      setError(`Failed to load YouTube data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processApiResponse = (apiData, timeframe) => {
    if (!apiData || !apiData.rows || apiData.rows.length === 0) {
      setError("No analytics data available for the selected period");
      return;
    }

    try {
      // Extract the time series data based on timeframe
      const viewsData = extractTimeSeriesData(apiData, timeframe);

      // Calculate growth trends
      const totalViews = viewsData.reduce((sum, val) => sum + val, 0);
      const trend = calculateGrowthTrend(viewsData);

      setPerformanceData({
        labels: generateLabels(timeframe),
        values: viewsData,
        trend: trend,
        total: totalViews,
        highestIndex: viewsData.indexOf(Math.max(...viewsData)),
        timeframe: timeframe,
        rawData: apiData,
      });
    } catch (err) {
      console.error("Error processing API response:", err);
      setError("Failed to process analytics data");
    }
  };

  const extractTimeSeriesData = (apiData, timeframe) => {
    // YouTube Analytics API returns data in different formats depending on the query
    // Ensure we extract the views data from the correct position in the response

    // This assumes the API returns daily views in a format like:
    // { rows: [[date1, views1, ...], [date2, views2, ...], ...] }
    const viewsIndex = apiData.columnHeaders.findIndex(
      (header) => header.name === "views"
    );

    if (viewsIndex === -1) {
      throw new Error("Views data not found in API response");
    }

    let viewsData = apiData.rows.map((row) => parseInt(row[viewsIndex]));

    // Aggregate data based on timeframe if needed
    if (timeframe === "month" && viewsData.length > 30) {
      // Group by day of month
      viewsData = aggregateDataByPeriod(viewsData, 30);
    } else if (timeframe === "year" && viewsData.length > 12) {
      // Group by month
      viewsData = aggregateDataByPeriod(viewsData, 12);
    } else if (timeframe === "week" && viewsData.length > 7) {
      // Ensure we only have 7 days for a week
      viewsData = viewsData.slice(-7);
    }

    return viewsData;
  };

  const aggregateDataByPeriod = (data, periods) => {
    const result = Array(periods).fill(0);
    const itemsPerPeriod = Math.ceil(data.length / periods);

    for (let i = 0; i < data.length; i++) {
      const periodIndex = Math.min(Math.floor(i / itemsPerPeriod), periods - 1);
      result[periodIndex] += data[i];
    }

    return result;
  };

  const calculateGrowthTrend = (viewsData) => {
    if (viewsData.length < 2) return "+0.0%";

    // Split data in half to compare earlier period with later period
    const midPoint = Math.floor(viewsData.length / 2);
    const earlierPeriod = viewsData.slice(0, midPoint);
    const laterPeriod = viewsData.slice(midPoint);

    const earlierSum = earlierPeriod.reduce((sum, val) => sum + val, 0);
    const laterSum = laterPeriod.reduce((sum, val) => sum + val, 0);

    if (earlierSum === 0) return "+∞%";

    const growthRate = ((laterSum - earlierSum) / earlierSum) * 100;
    return `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(1)}%`;
  };

  const generateLabels = (timeframe) => {
    const labels = [];
    const today = new Date();

    switch (timeframe) {
      case "week":
        // Generate last 7 days labels (e.g., "Mon", "Tue", etc.)
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
        }
        break;

      case "month":
        // Generate last 30 days as numbered days or abbreviated dates
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          labels.push(date.getDate().toString());
        }
        break;

      case "year":
        // Generate last 12 months (e.g., "Jan", "Feb", etc.)
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(today.getMonth() - i);
          labels.push(date.toLocaleDateString("en-US", { month: "short" }));
        }
        break;
    }

    return labels;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Channel Performance
          </h2>
          <p className="text-sm text-gray-500">
            Analytics from your YouTube channel
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 md:mt-0 bg-gray-100 rounded-md p-1">
          {["week", "month", "year"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                activeTimeframe === timeframe
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="h-64 bg-gray-50 animate-pulse rounded-lg">
          <div className="flex h-full items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-500"
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
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="h-64 bg-gray-50 flex flex-col items-center justify-center rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-gray-600 text-sm max-w-md text-center px-4">
            {error}
          </p>
          <button
            onClick={() => fetchChannelPerformance(activeTimeframe)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      ) : performanceData ? (
        <>
          {/* Performance Chart */}
          <div className="h-64 bg-gray-50 flex items-center justify-center rounded-lg">
            <div className="w-full h-full flex items-end justify-around px-4 pt-4">
              {performanceData.values.map((views, index) => {
                // Normalize the height to percentage of maximum value
                const maxValue = Math.max(...performanceData.values);
                const normalizedHeight = (views / maxValue) * 100;

                return (
                  <div key={index} className="relative group">
                    <div
                      className={`w-10 ${
                        index === performanceData.highestIndex
                          ? "bg-indigo-600"
                          : "bg-indigo-200"
                      } rounded-t transition duration-300 ease-in-out group-hover:bg-indigo-400`}
                      style={{ height: `${normalizedHeight}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 transition">
                      {formatViews(views)} views
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {performanceData.labels.map((label, i) => (
              <div key={i} className="text-center">
                <div>{label}</div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl font-semibold">
                  {formatViews(performanceData.total)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Growth Trend</p>
                <p
                  className={`text-xl font-semibold ${
                    performanceData.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {performanceData.trend}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Best Performing Day</p>
                <p className="text-xl font-semibold">
                  {performanceData.labels[performanceData.highestIndex]}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-64 bg-gray-50 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-6 text-right">
        <a
          href="https://studio.youtube.com/channel/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-end"
        >
          View complete analytics
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
