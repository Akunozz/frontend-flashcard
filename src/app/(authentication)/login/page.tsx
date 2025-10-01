import { LoginForm } from "@/components/login/login-form";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-50 via-emerald-100 to-emerald-200 flex items-center justify-center px-3 dark:bg-gradient-to-b dark:from-emerald-800 dark:via-emerald-900 dark:to-emerald-950">
      <span className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </span>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
