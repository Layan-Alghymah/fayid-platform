// ──────────────────────────────────────────────────────────────────────────────
// Admin Login — intentionally has NO public Navbar or Layout.
// Accessible only via direct URL: /admin-login
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldAlert, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");

  // Already authenticated admin → redirect straight to dashboard
  useEffect(() => {
    if (!isLoading && isAdminAuthenticated) {
      setLocation("/admin");
    }
  }, [isLoading, isAdminAuthenticated, setLocation]);

  // ─── Login mutation ────────────────────────────────────────────────────────
  // REAL AUTH SWAP: replace useLogin with useAdminLogin when a dedicated
  // admin auth endpoint is available.

  const loginMut = useLogin({
    mutation: {
      onSuccess: (data: any) => {
        // Role gate — only admin users may enter
        if (data?.user?.role !== "admin") {
          // Clear any stored token for non-admin logins
          localStorage.removeItem("auth_token");
          queryClient.clear();
          setError("هذا الحساب لا يملك صلاحيات المشرف");
          return;
        }
        if (data?.token) {
          localStorage.setItem("auth_token", data.token);
        }
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/admin");
      },
      onError: () => {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMut.mutate({ data: { email, password } });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(25,81,85,0.12),transparent_65%)]" />

      <div className="relative z-10 w-full max-w-sm animate-in fade-in duration-300">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground">دخول المشرف</h1>
          <p className="text-muted-foreground text-sm mt-1">منصة فائض — لوحة الإدارة الداخلية</p>
        </div>

        {/* Form card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setError(""); setEmail(e.target.value); }}
                placeholder="admin@faed.com"
                required
                dir="ltr"
                className="h-11"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setError(""); setPassword(e.target.value); }}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  className="h-11 pl-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 mt-1"
              disabled={loginMut.isPending}
            >
              <Lock className="w-4 h-4" />
              {loginMut.isPending ? "جارٍ التحقق..." : "دخول"}
            </Button>

          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-6 select-none">
          هذه الصفحة مخصصة لفريق الإدارة فقط — غير مرتبطة بالتنقل العام
        </p>
      </div>
    </div>
  );
}
