import { getAccessToken, setAccessToken } from "./cookies";

type Json = Record<string, unknown> | unknown[];

export class HttpError extends Error {
   status: number;
   body?: unknown;
   constructor(message: string, status: number, body?: unknown) {
      super(message);
      this.status = status;
      this.body = body;
   }
}

function withAuthHeaders(init?: RequestInit) {
   const headers = new Headers(init?.headers);
   const access = typeof window !== "undefined" ? getAccessToken() : null;
   if (access) headers.set("Authorization", `Bearer ${access}`);
   if (!headers.has("Content-Type") && init?.body) {
      headers.set("Content-Type", "application/json");
   }
   return { ...init, headers };
}

export async function apiFetch(
   input: string | URL,
   init?: RequestInit
): Promise<Response> {
   let res = await fetch(input, withAuthHeaders(init));

   if (res.status !== 401) return res;

   if (typeof window === "undefined") return res;

   const ref = await fetch("/api/refresh", { method: "POST" });
   if (!ref.ok) return res;

   const { accessToken } = await ref.json();
   if (accessToken) setAccessToken(accessToken);

   res = await fetch(input, withAuthHeaders(init));
   return res;
}

export async function apiJson<T = Json>(
   input: string | URL,
   init?: RequestInit
): Promise<T> {
   const res = await apiFetch(input, init);
   const contentType = res.headers.get("content-type") || "";
   const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

   if (!res.ok) {
      throw new HttpError(`HTTP ${res.status} on ${input}`, res.status, body);
   }
   return body as T;
}
