import { NextRequest } from "next/server";

const TRAIN_API_URL = process.env.TRAIN_API_URL || "";
const TRAIN_API_KEY = process.env.TRAIN_API_KEY || "";

type Params = { path: string[] };

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { path } = await params;
  const { search } = new URL(req.url);

  const upstream = await fetch(`${TRAIN_API_URL}/train/${path.join("/")}${search}`, {
    headers: { "x-api-key": TRAIN_API_KEY },
  });

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { path } = await params;
  const body = await req.json();

  const upstream = await fetch(`${TRAIN_API_URL}/train/${path.join("/")}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TRAIN_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}
