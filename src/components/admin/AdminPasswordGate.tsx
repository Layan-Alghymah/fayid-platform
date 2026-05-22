import { useState, type ReactNode } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export function AdminPasswordGate({ children }: { children: ReactNode }) {
  const { isAdmin, login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAdmin) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-background px-4"
    >
      <div className="w-full max-w-sm glass-panel rounded-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground text-center">
            أدخل كلمة المرور للوصول
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            dir="ltr"
            autoFocus
          />
          {error && (
            <p className="text-destructive text-sm text-center">
              كلمة المرور غير صحيحة
            </p>
          )}
          <Button type="submit" className="w-full" size="lg">
            دخول
          </Button>
        </form>
      </div>
    </div>
  );
}
