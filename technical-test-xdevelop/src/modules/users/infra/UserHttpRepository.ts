import { User } from "../domain/types";
import { apiFetch } from "@/shared/lib/apiClient";

export async function fetchUsers(
   page: number
): Promise<{ users: User[]; totalPages: number }> {
   const res = await apiFetch(`/api/reqres-users?page=${page}`);
   const json = await res.json();
   const users: User[] = (json.data ?? []).map((u: any) => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      avatar: u.avatar,
      role: Math.random() > 0.5 ? "admin" : "user",
   }));
   return { users, totalPages: json.total_pages ?? 1 };
}
