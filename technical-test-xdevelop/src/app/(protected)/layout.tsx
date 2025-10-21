"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAccessToken } from "@/shared/lib/cookies";
import { useSession } from "@/modules/auth/app/useSession";

const links = [
   { href: "/users", label: "Usuarios" },
   { href: "/posts", label: "Publicaciones" },
];

export default function ProtectedLayout({ children }: PropsWithChildren) {
   const router = useRouter();
   const pathname = usePathname();
   const { email } = useSession();

   const doLogout = async () => {
      await fetch("/api/logout", { method: "POST" });
      clearAccessToken();
      useSession.getState().logout();
      router.push("/login");
   };

   return (
      <div className="min-h-screen">
         <header className="border-b bg-background">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
               <Link href="/users" className="font-semibold">
                  XDevelop Front-End Developer
               </Link>
               <nav className="flex items-center gap-4">
                  {links.map((l) => {
                     const active = pathname.startsWith(l.href);
                     return (
                        <Link
                           key={l.href}
                           href={l.href}
                           className={`text-sm ${
                              active
                                 ? "font-medium"
                                 : "opacity-80 hover:opacity-100"
                           }`}
                        >
                           {l.label}
                        </Link>
                     );
                  })}
               </nav>
               <div className="flex items-center gap-3">
                  <span className="text-xs opacity-70 hidden sm:inline">
                     {email}
                  </span>
                  <Button variant="secondary" size="sm" onClick={doLogout}>
                     Cerrar sesión
                  </Button>
               </div>
            </div>
         </header>

         <main>{children}</main>
      </div>
   );
}
