"use client";

import * as React from "react";
import { useListUsers } from "../app/useListUsers";
import { User } from "../domain/types";
import {
   ColumnDef,
   getCoreRowModel,
   useReactTable,
   flexRender,
   getPaginationRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import {
   Table,
   TableHeader,
   TableHead,
   TableRow,
   TableBody,
   TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

type RoleFilter = "all" | "admin" | "user";

const roleLabel = {
   admin: "Administrador",
   user: "Usuario",
} as const;

export function UsersTable() {
   const [page, setPage] = React.useState(1);
   const [q, setQ] = React.useState("");
   const [role, setRole] = React.useState<RoleFilter>("all");
   const [rowSelection, setRowSelection] = React.useState(
      {} as Record<string, boolean>
   );

   const { data, isFetching, isError } = useListUsers(page);

   const rows = React.useMemo<User[]>(() => {
      const list = data?.users ?? [];
      if (!q && role === "all") return list;
      const lower = q.toLowerCase();
      return list.filter((u) => {
         const matchQ = `${u.firstName} ${u.lastName} ${u.email}`
            .toLowerCase()
            .includes(lower);
         const matchRole = role === "all" ? true : u.role === role;
         return matchQ && matchRole;
      });
   }, [data?.users, q, role]);

   const columns = React.useMemo<ColumnDef<User>[]>(
      () => [
         {
            id: "select",
            header: ({ table }) => (
               <Checkbox
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                  aria-label="Seleccionar todos"
               />
            ),
            cell: ({ row }) => (
               <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(v) => row.toggleSelected(!!v)}
                  aria-label={`Seleccionar fila ${row.id}`}
               />
            ),
            size: 30,
         },
         { accessorKey: "id", header: "ID" },
         {
            id: "name",
            header: "Nombre",
            cell: ({ row }) =>
               `${row.original.firstName} ${row.original.lastName}`,
         },
         { accessorKey: "email", header: "Correo electrónico" },
         {
            accessorKey: "role",
            header: "Rol",
            cell: ({ row }) => (
               <span className="uppercase text-xs font-medium">
                  {roleLabel[row.original.role]}
               </span>
            ),
         },
      ],
      []
   );

   const table = useReactTable({
      data: rows,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      state: { rowSelection },
   });

   const totalPages = data?.totalPages ?? 1;

   return (
      <div className="space-y-4">
         {/* Controles */}
         <div className="flex flex-wrap gap-2 items-center">
            <Input
               placeholder="Buscar por nombre o correo…"
               value={q}
               onChange={(e) => setQ(e.target.value)}
               className="w-[260px]"
               aria-label="Buscar"
            />

            <Select
               value={role}
               onValueChange={(v) => setRole(v as RoleFilter)}
            >
               <SelectTrigger
                  className="w-[160px]"
                  aria-label="Filtrar por rol"
               >
                  <SelectValue placeholder="Rol" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Tabla */}
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                     <TableRow key={hg.id}>
                        {hg.headers.map((h) => (
                           <TableHead key={h.id} style={{ width: h.getSize() }}>
                              {flexRender(
                                 h.column.columnDef.header,
                                 h.getContext()
                              )}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>

               <TableBody>
                  {isError && (
                     <TableRow>
                        <TableCell colSpan={columns.length}>
                           Error al cargar usuarios.
                        </TableCell>
                     </TableRow>
                  )}

                  {isFetching &&
                     table.getRowModel().rows.length === 0 &&
                     Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={`sk-${i}`}>
                           <TableCell colSpan={columns.length}>
                              <Skeleton className="h-6 w-full" />
                           </TableCell>
                        </TableRow>
                     ))}

                  {!isFetching && table.getRowModel().rows.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={columns.length}>
                           Sin resultados.
                        </TableCell>
                     </TableRow>
                  )}

                  {table.getRowModel().rows.map((row) => (
                     <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                     >
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>
                              {flexRender(
                                 cell.column.columnDef.cell,
                                 cell.getContext()
                              )}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         {/* Paginación */}
         <div className="flex items-center justify-between">
            <div className="text-sm opacity-70">
               Página {page} / {totalPages}
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
               >
                  Siguiente
               </Button>
            </div>
         </div>
      </div>
   );
}
