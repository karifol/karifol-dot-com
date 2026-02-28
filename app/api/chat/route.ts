import { NextRequest } from "next/server";

const STREAMING_API_URL = process.env.STREAMING_API_URL || "";
const STREAMING_API_KEY = process.env.STREAMING_API_KEY || "";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(`${STREAMING_API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": STREAMING_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
