"use client";
import Cookies from "js-cookie";

const ACCESS = "accessToken";

export function getAccessToken() {
   return Cookies.get(ACCESS) ?? null;
}

export function setAccessToken(token: string) {
   Cookies.set(ACCESS, token, { sameSite: "lax" });
}

export function clearAccessToken() {
   Cookies.remove(ACCESS);
}
