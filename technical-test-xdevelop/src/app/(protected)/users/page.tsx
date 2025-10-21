import { UsersTable } from "@/modules/users/ui/UsersTable";

export default function UsersPage() {
   return (
      <main className="p-6 space-y-4">
         <h1 className="text-2xl font-semibold">Users</h1>
         <UsersTable />
      </main>
   );
}
