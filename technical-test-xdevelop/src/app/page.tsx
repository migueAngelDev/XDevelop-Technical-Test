"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/shared/lib/cookies";

export default function Home() {
   const router = useRouter();
   const [logged, setLogged] = React.useState(false);

   React.useEffect(() => {
      setLogged(!!getAccessToken());
   }, []);

   return (
      <div className="min-h-dvh flex flex-col">
         <header className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
               <Link href="/" className="font-semibold">
                  XDevelop
               </Link>
               <nav className="flex items-center gap-4 text-sm">
                  {logged ? (
                     <>
                        <Link
                           className="opacity-80 hover:opacity-100"
                           href="/users"
                        >
                           Usuarios
                        </Link>
                        <Link
                           className="opacity-80 hover:opacity-100"
                           href="/posts"
                        >
                           Publicaciones
                        </Link>
                        <Link
                           className="opacity-80 hover:opacity-100"
                           href="/books"
                        >
                           Libros
                        </Link>
                     </>
                  ) : (
                     <>
                        <Link
                           className="opacity-80 hover:opacity-100"
                           href="/login"
                        >
                           Iniciar sesión
                        </Link>
                        <Link
                           className="opacity-80 hover:opacity-100"
                           href="/register"
                        >
                           Crear cuenta
                        </Link>
                     </>
                  )}
               </nav>
            </div>
         </header>

         <main className="flex-1 grid place-items-center px-6">
            <section className="mx-auto w-full max-w-5xl grid gap-8 md:grid-cols-2 items-center">
               <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold">
                     Prueba técnica — Frontend (Next.js)
                  </h1>
                  <p className="text-muted-foreground">
                     Demo con autenticación por cookies + middleware, estado
                     global con Zustand, data fetching con TanStack Query, y
                     tablas con TanStack Table/shadcn.
                  </p>
                  <div className="flex flex-wrap gap-3">
                     {logged ? (
                        <Button onClick={() => router.push("/users")}>
                           Ir al panel
                        </Button>
                     ) : (
                        <>
                           <Button asChild>
                              <Link href="/login">Iniciar sesión</Link>
                           </Button>
                           <Button asChild variant="outline">
                              <Link href="/register">Crear cuenta</Link>
                           </Button>
                        </>
                     )}
                  </div>
                  {!logged && (
                     <p className="text-xs text-muted-foreground">
                        Para probar rápido: <code>eve.holt@reqres.in</code> /{" "}
                        <code>cityslicka</code>.
                     </p>
                  )}
               </div>

               <div className="rounded-2xl border p-5 bg-muted/30">
                  <h2 className="font-semibold mb-3">Qué incluye</h2>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                     <li>
                        Autenticación con cookies (access + refresh HttpOnly) y
                        protección por <code>middleware</code>.
                     </li>
                     <li>
                        Estado global de sesión con <strong>Zustand</strong>.
                     </li>
                     <li>
                        Data fetching/mutaciones con{" "}
                        <strong>TanStack Query</strong> (optimistic updates en
                        Posts).
                     </li>
                     <li>
                        Tabla de Usuarios con <strong>TanStack Table</strong> +
                        shadcn (búsqueda/filtro/paginación).
                     </li>
                     <li>APIs: ReqRes, JSONPlaceholder y Open Library.</li>
                     <li>
                        Arquitectura modular (slices) con TypeScript + Tailwind
                        + shadcn.
                     </li>
                  </ul>
               </div>
            </section>
         </main>

         <footer className="border-t">
            <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between text-xs text-muted-foreground">
               <span>© {new Date().getFullYear()} XDevelop Demo</span>
               <span>Next.js • TanStack • Zustand • shadcn/ui</span>
            </div>
         </footer>
      </div>
   );
}
