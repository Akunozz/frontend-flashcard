import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoaderCircle className="animate-spin w-8 h-8 text-primary mb-2" />
      <span className="text-sm text-muted-foreground">Carregando...</span>
    </div>
  );
}