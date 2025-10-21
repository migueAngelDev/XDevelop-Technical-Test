"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../infra/UserHttpRepository";

export function useListUsers(page: number) {
   return useQuery({
      queryKey: ["users", page],
      queryFn: () => fetchUsers(page),
      staleTime: 30_000,
   });
}
