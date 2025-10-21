"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAccessToken, clearAccessToken } from "@/shared/lib/cookies";
import { useSession } from "@/modules/auth/app/useSession";

export default function LoginPage() {
   const [email, setEmail] = useState("eve.holt@reqres.in");
   const [password, setPassword] = useState("cityslicka");
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const router = useRouter();
   const sp = useSearchParams();
   const next = sp.get("next") || "/users";
   const login = useSession((s) => s.login);

   async function onSubmit(e: FormEvent) {
      e.preventDefault();
      setLoading(true);
      clearAccessToken();

      try {
         const r = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
         });

         if (!r.ok) {
            const body = await r.json().catch(() => ({}));
            throw new Error(body?.error || "Login failed");
         }

         const { accessToken, role } = await r.json();
         setAccessToken(accessToken);
         login({ role, email });

         console.log({
            title: "Bienvenido",
            description: `Sesión iniciada como ${role}`,
         });
         router.push(next);
      } catch (err) {
         const message =
            err instanceof Error
               ? err.message
               : "Un error desconocido ocurrió.";
         console.error({
            title: "Error de autenticación",
            description: message,
         });
      } finally {
         setLoading(false);
      }
   }

   return (
      <main className="h-dvh flex items-center justify-center p-6 bg-gray-50">
         <form
            onSubmit={onSubmit}
            className="w-full max-w-sm space-y-6 bg-white shadow-xl border rounded-xl p-8"
         >
            <h1 className="text-2xl font-bold text-center text-gray-800">
               Iniciar Sesión
            </h1>

            <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="password">Contraseña</Label>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     autoComplete="current-password"
                     className="pr-10"
                  />
                  <button
                     type="button"
                     className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                     onClick={() => setShowPassword((prev) => !prev)}
                     aria-label={
                        showPassword
                           ? "Ocultar contraseña"
                           : "Mostrar contraseña"
                     }
                  >
                     {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
               </div>
            </div>

            <Button type="submit" className="w-full py-2" disabled={loading}>
               {loading ? "Entrando…" : "Entrar"}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
               Para probar: Usa <code>eve.holt@reqres.in</code> /{" "}
               <code>cityslicka</code>.
            </p>
         </form>
      </main>
   );
}
