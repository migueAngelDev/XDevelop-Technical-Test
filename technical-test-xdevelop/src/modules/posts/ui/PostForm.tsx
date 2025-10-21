"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
   initial?: { title: string; body: string };
   onSubmit: (values: { title: string; body: string }) => void;
   submitting?: boolean;
};

export function PostForm({ initial, onSubmit, submitting }: Props) {
   const [title, setTitle] = React.useState(initial?.title ?? "");
   const [body, setBody] = React.useState(initial?.body ?? "");

   return (
      <form
         className="space-y-3"
         onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title, body });
         }}
      >
         <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Título"
            required
         />
         <Textarea
            placeholder="Contenido"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            aria-label="Contenido"
            required
         />
         <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando…" : "Guardar"}
         </Button>
      </form>
   );
}
