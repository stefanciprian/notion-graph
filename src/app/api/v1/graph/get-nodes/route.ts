import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export async function GET() {
  try {
    const databaseId = process.env.NOTION_RELATIONSHIPS_DATABASE_ID || "";
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return NextResponse.json(response.results);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { message: "POST method not allowed" },
    { status: 405 }
  );
}
