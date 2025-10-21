import { NextResponse } from "next/server";

const BASE = process.env.REQRES_BASE_URL ?? "https://reqres.in/api";
const KEY = process.env.REQRES_API_KEY;

if (!KEY) console.warn("[reqres] Missing REQRES_API_KEY");

export async function GET(req: Request) {
   const url = new URL(req.url);
   const page = url.searchParams.get("page") ?? "1";

   const r = await fetch(`${BASE}/users?page=${page}`, {
      headers: {
         "x-api-key": KEY!,
      },
   });

   const data = await r.json().catch(() => ({}));
   return NextResponse.json(data, { status: r.status });
}
