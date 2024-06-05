// pages/api/v1/graph/getNodes.js
import { Client } from "@notionhq/client";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export async function getNodes() {
  const databaseId = process.env.NOTION_NODES_DATABASE_ID || ""; // Set a default value if the variable is undefined
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results;
}

export default async function handler(req: any, res: any) {
  try {
    const nodes = await getNodes();
    res.status(200).json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
}
