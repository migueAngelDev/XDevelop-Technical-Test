"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePingJsonPlaceholder } from "@/shared/lib/smokeTest";

export default function UIPreview() {
   const pingJson = usePingJsonPlaceholder();

   console.log({
      dt: pingJson.data,
   });

   return (
      <main className="p-6 space-y-4">
         <h1 className="text-2xl font-semibold">UI Preview</h1>
         <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
               id="email"
               placeholder="email@example.com"
               className="max-w-sm"
            />
         </div>
         <Button onClick={() => console.log("Hello world")}>Probar UI</Button>
      </main>
   );
}
