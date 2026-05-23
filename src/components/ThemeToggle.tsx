import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  // Keep browser-tab favicon in sync with the active theme
  useEffect(() => {
    const favicon = document.getElementById("dynamic-favicon") as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = isDark ? "/logo-dark.png" : "/logo-light.png";
    }
  }, [isDark]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full text-foreground hover:bg-white/5"
      aria-label={isDark ? "وضع فاتح" : "وضع داكن"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
