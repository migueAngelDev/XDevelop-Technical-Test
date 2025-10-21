export type User = {
   id: number;
   email: string;
   firstName: string;
   lastName: string;
   avatar: string;
   role: "admin" | "user"; // estos son roles simulados para filtros/permiso
};
