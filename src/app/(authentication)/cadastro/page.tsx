import Cadastro from "@/components/cadastro/cadastro";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function CadastroPage() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-3">
      <span className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </span>

      <div className="w-full max-w-md">
        <Cadastro />
      </div>
    </div>
  );
}
