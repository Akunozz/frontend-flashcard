import { LoginForm } from "@/components/login/login-form";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 dark:bg-gradient-to-br dark:from-emerald-900 dark:via-white/10 dark:to-teal-900">
      <div className="w-full max-w-md">
        <span className="flex justify-end">
          <ModeToggle />
        </span>
        <LoginForm />
      </div>
    </div>
  );
}
