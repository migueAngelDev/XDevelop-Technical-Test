"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useListPosts, useCreatePost } from "@/modules/posts/app/usePosts";
import { PostForm } from "@/modules/posts/ui/PostForm";
import { useSession } from "@/modules/auth/app/useSession";

export default function PostsPage() {
   const [page, setPage] = React.useState(1);

   const [userFilter, setUserFilter] = React.useState<"all" | `${number}`>(
      "all"
   );

   // Mapear a número cuando se consume el hook
   const userId = userFilter === "all" ? undefined : Number(userFilter);

   const { data, isFetching, isError } = useListPosts(page, userId);
   const { role } = useSession();
   const canEdit = role === "admin";
   const create = useCreatePost(userId ?? 1);

   return (
      <main className="p-6 space-y-4">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Publicaciones</h1>
            {canEdit && (
               <Dialog>
                  <DialogTrigger asChild>
                     <Button>Crear</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Nueva publicación</DialogTitle>
                     </DialogHeader>
                     <PostForm
                        onSubmit={(vals) => create.mutate(vals)}
                        submitting={create.isPending}
                     />
                  </DialogContent>
               </Dialog>
            )}
         </div>

         <div className="flex gap-2 items-center">
            <span className="text-sm">Filtrar por usuario:</span>
            <Select
               value={userFilter}
               onValueChange={(v) => setUserFilter(v as "all" | `${number}`)}
            >
               <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Todos" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((u) => (
                     <SelectItem key={u} value={`${u}`}>
                        Usuario {u}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {isError && <p className="text-sm text-red-500">Error al cargar.</p>}

         <ul className="space-y-3">
            {(data?.posts ?? []).map((p) => (
               <li key={p.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                     <Link
                        href={`/posts/${p.id}`}
                        className="font-medium hover:underline"
                     >
                        {p.title}
                     </Link>
                     {canEdit && (
                        <Link
                           href={`/posts/${p.id}?edit=1`}
                           className="text-sm underline"
                        >
                           Editar
                        </Link>
                     )}
                  </div>
                  <p className="text-sm opacity-80 mt-1 line-clamp-2">
                     {p.body}
                  </p>
                  <div className="text-xs opacity-60 mt-2">
                     Usuario {p.userId}
                  </div>
               </li>
            ))}
         </ul>

         <div className="flex items-center justify-between">
            <div className="text-sm opacity-70">
               Página {page} / {data?.totalPages ?? 1}
            </div>
            <div className="flex gap-2">
               <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
               >
                  Anterior
               </Button>
               <Button
                  variant="outline"
                  onClick={() =>
                     setPage((p) => Math.min(data?.totalPages ?? 1, p + 1))
                  }
                  disabled={page >= (data?.totalPages ?? 1)}
               >
                  Siguiente
               </Button>
            </div>
         </div>
         {isFetching && <p className="text-sm opacity-60">Cargando…</p>}
      </main>
   );
}
