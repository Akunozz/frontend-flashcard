import Cadastro from "@/components/cadastro/cadastro";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-3 dark:bg-gradient-to-br dark:from-emerald-900 dark:via-white/10 dark:to-teal-900">
      <div className="w-full max-w-md">
        <span className="flex justify-end mt-2">
          <ModeToggle />
        </span>
        <Cadastro />
      </div>
    </div>
  );
}
