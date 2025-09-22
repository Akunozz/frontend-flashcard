import { LoginForm } from "@/components/login/login-form";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-3 dark:bg-gradient-to-tr dark:from-emerald-500 dark:via-emerald-800 dark:to-emerald-950">
      <span className="absolute top-0 right-0 flex justify-end mt-2 mr-2">
        <ModeToggle />
      </span>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
