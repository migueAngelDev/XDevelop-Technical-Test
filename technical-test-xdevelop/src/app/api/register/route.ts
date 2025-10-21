import { NextResponse } from "next/server";

const REQRES_BASE_URL = process.env.REQRES_BASE_URL ?? "https://reqres.in/api";
const REQRES_API_KEY = process.env.REQRES_API_KEY;
const ALLOW_FAKE = process.env.ALLOW_FAKE_REGISTER === "true";

export async function POST(req: Request) {
   try {
      const { email, password } = await req.json();
      if (!email || !password) {
         return NextResponse.json(
            { error: "Faltan credenciales" },
            { status: 400 }
         );
      }

      if (!REQRES_API_KEY) {
         if (!ALLOW_FAKE) {
            return NextResponse.json(
               { error: "Falta REQRES_API_KEY" },
               { status: 500 }
            );
         }
      }

      let ok = false;
      let token: string | undefined;
      if (REQRES_API_KEY) {
         const r = await fetch(`${REQRES_BASE_URL}/register`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-api-key": REQRES_API_KEY,
            },
            body: JSON.stringify({ email, password }),
         });

         const body = await r.json().catch(() => ({}));
         if (r.ok && body?.token) {
            ok = true;
            token = body.token as string;
         } else if (!r.ok && !ALLOW_FAKE) {
            return NextResponse.json(
               { error: body?.error ?? "Registro inválido" },
               { status: 400 }
            );
         }
      }

      if (!ok) {
         if (!ALLOW_FAKE) {
            return NextResponse.json(
               { error: "Registro no permitido" },
               { status: 400 }
            );
         }
         token = `demo-${Date.now()}`;
      }

      const domainPart = email.split("@")[1] || ""; // Verifica si la cadena "admin" (insensible a mayúsculas) está contenida en el dominio
      const role = /admin/i.test(domainPart) ? "admin" : "user";

      const res = NextResponse.json({ accessToken: token!, role, _demo: !ok });
      res.cookies.set(
         "refreshToken",
         `r.${Math.random().toString(36).slice(2)}`,
         {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
         }
      );
      return res;
   } catch (err: any) {
      return NextResponse.json(
         { error: err?.message ?? "Error inesperado" },
         { status: 500 }
      );
   }
}
