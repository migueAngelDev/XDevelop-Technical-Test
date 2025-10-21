import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
   const hasRefresh = (await cookies()).get("refreshToken");
   if (!hasRefresh) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
   }
   return NextResponse.json({ accessToken: `access-${Date.now()}` });
}
