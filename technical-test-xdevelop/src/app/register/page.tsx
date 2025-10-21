"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAccessToken, clearAccessToken } from "@/shared/lib/cookies";
import { useSession } from "@/modules/auth/app/useSession";

export default function RegisterPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const login = useSession((s) => s.login);

   async function onSubmit(e: FormEvent) {
      e.preventDefault();
      setLoading(true);
      clearAccessToken();

      try {
         const r = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
         });

         const body = await r.json().catch(() => ({}));
         if (!r.ok) throw new Error(body?.error || "Fallo el registro");

         const { accessToken, role } = body;
         setAccessToken(accessToken);
         login({ role, email });
         router.push("/users");
      } catch (err: any) {
         // Puedes reemplazar por toast si ya tienes useToast
         console.error({
            title: "Error de registro",
            description: err.message,
         });
      } finally {
         setLoading(false);
      }
   }

   return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center gap-4 p-6">
         <form
            onSubmit={onSubmit}
            className="w-full max-w-sm space-y-4 border rounded-xl p-6 bg-background"
         >
            <h1 className="text-xl font-semibold text-center">Crear cuenta</h1>

            <div className="space-y-2">
               <Label htmlFor="email">Correo</Label>
               <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="password">Contraseña</Label>
               <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
               />
            </div>

            <Button
               type="submit"
               className="w-full"
               disabled={loading}
               aria-busy={loading}
            >
               {loading ? "Creando…" : "Crear cuenta"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
               ¿Ya tienes cuenta?{" "}
               <Link className="underline" href="/login">
                  Inicia sesión
               </Link>
            </p>
         </form>

         <p className="text-xs text-muted-foreground text-center max-w-sm">
            Nota: ReqRes solo permite registro de usuarios predefinidos. Si no
            coincide, el registro usará modo demostración.
         </p>
      </main>
   );
}
