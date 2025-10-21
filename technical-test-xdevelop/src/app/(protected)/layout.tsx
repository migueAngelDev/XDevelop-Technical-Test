"use client";

import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/shared/lib/cookies";
import { useSession } from "@/modules/auth/app/useSession";

export default function ProtectedLayout({ children }: PropsWithChildren) {
   const router = useRouter();
   const { isAuth, email } = useSession();
   const doLogout = async () => {
      await fetch("/api/logout", { method: "POST" });
      clearAccessToken();
      useSession.getState().logout();
      router.push("/login");
   };

   return (
      <div className="min-h-screen">
         <header className="flex items-center justify-between p-4 border-b">
            <div className="text-sm opacity-80">{isAuth ? email : ""}</div>
            <Button
               className="cursor-pointer"
               variant="secondary"
               onClick={doLogout}
            >
               Logout
            </Button>
         </header>
         <div>{children}</div>
      </div>
   );
}
