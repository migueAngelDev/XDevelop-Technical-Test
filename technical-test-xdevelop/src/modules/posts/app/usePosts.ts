"use client";
import {
   useQuery,
   useMutation,
   useQueryClient,
   keepPreviousData,
} from "@tanstack/react-query";
import {
   listPosts,
   getPost,
   getComments,
   createPost,
   updatePost,
} from "../infra/PostsHttpRepository";
import type { Post } from "../domain/types";

export function useListPosts(page: number, userId?: number) {
   return useQuery({
      queryKey: ["posts", { page, userId }],
      queryFn: () => listPosts(page, userId),
      placeholderData: keepPreviousData,
      staleTime: 30_000,
   });
}

export function usePostWithComments(id: number) {
   const post = useQuery({
      queryKey: ["post", id],
      queryFn: () => getPost(id),
      staleTime: 30_000,
   });
   const comments = useQuery({
      queryKey: ["post", id, "comments"],
      queryFn: () => getComments(id),
      staleTime: 30_000,
   });
   return { post, comments };
}

export function useCreatePost(userId: number) {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: (payload: { title: string; body: string }) =>
         createPost({ userId, ...payload }),
      onMutate: async (payload) => {
         const qKeys = qc
            .getQueryCache()
            .findAll({ queryKey: ["posts"] })
            .map((q) => q.queryKey);
         const optimistic: Post = {
            id: Date.now(),
            userId,
            title: payload.title,
            body: payload.body,
         };
         const prevs: unknown[] = [];

         for (const key of qKeys) {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData<{ posts: Post[]; totalPages: number }>(
               key
            );
            prevs.push([key, prev]);
            if (prev)
               qc.setQueryData(key, {
                  ...prev,
                  posts: [optimistic, ...prev.posts],
               });
         }
         return { prevs };
      },
      onError: (_err, _vars, ctx) => {
         ctx?.prevs?.forEach(([key, prev]: any) => qc.setQueryData(key, prev));
      },
      onSettled: () => {
         qc.invalidateQueries({ queryKey: ["posts"] });
      },
   });
}

export function useUpdatePost() {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: ({ id, patch }: { id: number; patch: Partial<Post> }) =>
         updatePost(id, patch),
      onMutate: async ({ id, patch }) => {
         const qKeys = qc
            .getQueryCache()
            .findAll({ queryKey: ["posts"] })
            .map((q) => q.queryKey);
         const prevs: unknown[] = [];
         for (const key of qKeys) {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData<{ posts: Post[]; totalPages: number }>(
               key
            );
            prevs.push([key, prev]);
            if (prev) {
               qc.setQueryData(key, {
                  ...prev,
                  posts: prev.posts.map((p) =>
                     p.id === id ? { ...p, ...patch } : p
                  ),
               });
            }
         }
         const postKey = ["post", id] as const;
         const prevPost = qc.getQueryData<Post>(postKey);
         if (prevPost) qc.setQueryData(postKey, { ...prevPost, ...patch });
         return { prevs, prevPost };
      },
      onError: (_e, { id }, ctx) => {
         ctx?.prevs?.forEach(([key, prev]: any) =>
            qc.setQueryData(key, prev)
         );
         if (ctx?.prevPost) qc.setQueryData(["post", id], ctx.prevPost);
      },
      onSettled: (_d, _e, { id }) => {
         qc.invalidateQueries({ queryKey: ["posts"] });
         qc.invalidateQueries({ queryKey: ["post", id] });
      },
   });
}
