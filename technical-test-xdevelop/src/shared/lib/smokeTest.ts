import { useQuery } from "@tanstack/react-query";
import { apiJson } from "./apiClient";

export function usePingJsonPlaceholder() {
   return useQuery({
      queryKey: ["ping"],
      queryFn: () => apiJson("https://jsonplaceholder.typicode.com/todos/1"),
   });
}
