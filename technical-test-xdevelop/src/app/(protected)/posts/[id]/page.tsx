"use client";

import * as React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
   usePostWithComments,
   useUpdatePost,
} from "@/modules/posts/app/usePosts";
import { useSession } from "@/modules/auth/app/useSession";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { PostForm } from "@/modules/posts/ui/PostForm";

export default function PostDetail() {
   const { id: idParam } = useParams<{ id: string }>();
   const id = Number(idParam);

   const { role } = useSession();
   const canEdit = role === "admin";
   const { post, comments } = usePostWithComments(id);

   const sp = useSearchParams();
   const edit = sp.get("edit") === "1";
   const router = useRouter();

   const update = useUpdatePost();

   if (post.isLoading) return <main className="p-6">Cargando…</main>;
   if (post.isError || !post.data)
      return <main className="p-6">No encontrado.</main>;

   return (
      <main className="p-6 space-y-4">
         <Link href="/posts" className="text-sm underline">
            ← Volver
         </Link>

         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{post.data.title}</h1>
            {canEdit && (
               <Dialog
                  defaultOpen={edit}
                  onOpenChange={(o) => !o && router.replace(`/posts/${id}`)}
               >
                  <DialogTrigger asChild>
                     <Button variant="outline">Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Editar publicación</DialogTitle>
                     </DialogHeader>
                     <PostForm
                        initial={{
                           title: post.data.title,
                           body: post.data.body,
                        }}
                        submitting={update.isPending}
                        onSubmit={(vals) => update.mutate({ id, patch: vals })}
                     />
                  </DialogContent>
               </Dialog>
            )}
         </div>

         <p className="opacity-80">{post.data.body}</p>

         <h2 className="font-medium mt-6">Comentarios</h2>
         <ul className="mt-2 space-y-2">
            {(comments.data ?? []).map((c) => (
               <li key={c.id} className="border rounded p-3">
                  <div className="text-sm font-medium">
                     {c.name} <span className="opacity-60">({c.email})</span>
                  </div>
                  <p className="text-sm mt-1">{c.body}</p>
               </li>
            ))}
         </ul>
      </main>
   );
}
