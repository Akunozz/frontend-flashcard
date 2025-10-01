import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full shadow-lg">
          <LoaderCircle className="animate-spin w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-4 font-medium">
        Carregando...
      </span>
    </div>
  );
}
