import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export function HomeBackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <ChevronRight className="w-4 h-4 ml-1" />
      العودة للرئيسية
    </Link>
  );
}
