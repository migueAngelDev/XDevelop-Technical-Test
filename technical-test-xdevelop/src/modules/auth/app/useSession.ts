"use client";
import { create } from "zustand";

export type Role = "admin" | "user";

type SessionState = {
   isAuth: boolean;
   role: Role | null;
   email: string | null;
   login: (payload: { role: Role; email: string }) => void;
   logout: () => void;
};

export const useSession = create<SessionState>((set) => ({
   isAuth: false,
   role: null,
   email: null,
   login: ({ role, email }) => set({ isAuth: true, role, email }),
   logout: () => set({ isAuth: false, role: null, email: null }),
}));
