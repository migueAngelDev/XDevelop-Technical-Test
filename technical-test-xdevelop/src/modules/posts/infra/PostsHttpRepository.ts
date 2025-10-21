import { apiFetch } from "@/shared/lib/apiClient";
import type { Post, Comment } from "../domain/types";

const BASE = "https://jsonplaceholder.typicode.com";

export async function listPosts(
   page: number,
   userId?: number
): Promise<{ posts: Post[]; totalPages: number }> {
   const limit = 10;
   const qs = new URLSearchParams({
      _page: String(page),
      _limit: String(limit),
   });
   if (userId) qs.set("userId", String(userId));

   const res = await apiFetch(`${BASE}/posts?${qs.toString()}`);
   const data = (await res.json()) as Post[];
   const total = Number(res.headers.get("x-total-count") || "100");
   const totalPages = Math.ceil(total / limit);
   return { posts: data, totalPages };
}

export async function getPost(id: number): Promise<Post> {
   const r = await apiFetch(`${BASE}/posts/${id}`);
   return r.json();
}

export async function getComments(postId: number): Promise<Comment[]> {
   const r = await apiFetch(`${BASE}/posts/${postId}/comments`);
   return r.json();
}

export async function createPost(payload: {
   userId: number;
   title: string;
   body: string;
}): Promise<Post> {
   const r = await apiFetch(`${BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
   return r.json();
}

export async function updatePost(
   id: number,
   payload: Partial<Post>
): Promise<Post> {
   const r = await apiFetch(`${BASE}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
   return r.json();
}
