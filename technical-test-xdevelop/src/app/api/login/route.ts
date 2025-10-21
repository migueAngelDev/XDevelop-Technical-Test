import { NextResponse } from "next/server";

const BASE_URL: string = process.env.REQRES_BASE_URL ?? "https://reqres.in/api";
const REQRES_API_KEY: string = process.env.REQRES_API_KEY ?? "";

export async function POST(req: Request) {
   const { email, password } = await req.json();

   console.log({
      BASE_URL,
      REQRES_API_KEY,
   });

   if (!email || !password) {
      return NextResponse.json(
         { error: "Missing credentials" },
         { status: 400 }
      );
   }

   // Login contra ReqRes
   const r = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "x-api-key": REQRES_API_KEY,
      },
      body: JSON.stringify({ email, password }),
   });

   if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      return NextResponse.json(
         { error: body?.error ?? "Invalid credentials" },
         { status: 401 }
      );
   }

   const { token } = await r.json(); // Extrae la parte del dominio después del '@'. Ej: de "test@admin.com" a "admin.com"

   // Lógica de Simulación de Rol
   const domainPart = email.split("@")[1] || ""; // Verifica si la cadena "admin" (insensible a mayúsculas) está contenida en el dominio
   const role = /admin/i.test(domainPart) ? "admin" : "user";

   // Setear refresh token HttpOnly (solo seguro en prod)
   // Se habilita solo en producción para evitar problemas de desarrollo local (que usa HTTP).
   const res = NextResponse.json({ accessToken: token, role });
   res.cookies.set("refreshToken", `r.${Math.random().toString(36).slice(2)}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
   });
   return res;
}
