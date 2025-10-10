import AuthForm from "@/components/AuthForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-ring/5">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-2" data-testid="text-auth-brand">
            SS Jewels
          </h1>
          <p className="text-muted-foreground">Welcome back to your jewelry collection</p>
        </div>

        <div className="bg-card rounded-lg border p-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
