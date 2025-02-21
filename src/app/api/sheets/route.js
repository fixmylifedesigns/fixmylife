// src/app/api/sheets/route.js
import { google } from "googleapis";
import { NextResponse } from "next/server";

// Google Sheets credentials and configuration
// For production, these would be stored in environment variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Initialize the Google Sheets API client
const getAuthClient = () => {
  const auth = new google.auth.JWT(
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY.replace(/\\n/g, "\n"),
    SCOPES
  );
  return auth;
};

// GET handler to fetch scheduled posts
export async function GET(request) {
  try {
    // Validate authentication (this would use NextAuth in production)
    // For demo purposes, we'll skip actual auth validation

    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Get data from the "Scheduled Posts" sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Scheduled Posts!A2:H",
    });

    const rows = response.data.values || [];

    // Transform the raw data into structured objects
    const scheduledPosts = rows.map((row) => ({
      id: row[0],
      tiktokUrl: row[1],
      youtubeTitle: row[2],
      youtubeDescription: row[3],
      scheduledFor: row[4],
      status: row[5],
      tags: row[6] ? row[6].split(",") : [],
      visibility: row[7] || "public",
    }));

    return NextResponse.json({
      success: true,
      data: scheduledPosts,
    });
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// POST handler to add a new scheduled post
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const {
      tiktokUrl,
      youtubeTitle,
      youtubeDescription,
      scheduledFor,
      tags,
      visibility,
      category,
    } = body;

    if (!tiktokUrl || !youtubeTitle || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique ID (in production, use UUID)
    const id = Date.now().toString();

    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Add data to the "Scheduled Posts" sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Scheduled Posts!A2:H",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [
          [
            id,
            tiktokUrl,
            youtubeTitle,
            youtubeDescription || "",
            scheduledFor,
            "scheduled",
            tags || "",
            visibility || "public",
            category || "",
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      data: { id, message: "Post scheduled successfully" },
    });
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a scheduled post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // First, find the row with the matching ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Scheduled Posts!A2:A",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Delete the row (A1 notation: row index is 0-based, but sheets are 1-based)
    const actualRowIndex = rowIndex + 2; // +2 because we start at A2

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming "Scheduled Posts" is the first sheet
                dimension: "ROWS",
                startIndex: actualRowIndex - 1,
                endIndex: actualRowIndex,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Post deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting from Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a scheduled post
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // First, find the row with the matching ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Scheduled Posts!A2:H",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Get the existing row data
    const existingRow = rows[rowIndex];

    // Update the row with new data, keeping existing data where not provided
    const updatedRow = [
      id,
      updateData.tiktokUrl || existingRow[1],
      updateData.youtubeTitle || existingRow[2],
      updateData.youtubeDescription || existingRow[3],
      updateData.scheduledFor || existingRow[4],
      updateData.status || existingRow[5],
      updateData.tags || existingRow[6],
      updateData.visibility || existingRow[7],
      updateData.category || existingRow[8] || "",
    ];

    // Update the row (A1 notation: row index is 0-based, but sheets are 1-based)
    const actualRowIndex = rowIndex + 2; // +2 because we start at A2

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Scheduled Posts!A${actualRowIndex}:I${actualRowIndex}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [updatedRow],
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Post updated successfully" },
    });
  } catch (error) {
    console.error("Error updating Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}
