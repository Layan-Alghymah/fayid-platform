import { Link } from "wouter";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users } from "lucide-react";

export function AdminNav() {
  const { logout } = useAdminAuth();

  return (
    <header
      dir="rtl"
      className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-black text-primary text-lg ml-4">فائض</span>
          <span className="text-muted-foreground text-xs">Admin</span>
        </div>

        <nav className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2 text-sm">
              <LayoutDashboard className="w-4 h-4" />
              الرئيسية
            </Button>
          </Link>
          <Link href="/admin/suppliers">
            <Button variant="ghost" size="sm" className="gap-2 text-sm">
              <Users className="w-4 h-4" />
              الموردون
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm text-muted-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        </nav>
      </div>
    </header>
  );
}
