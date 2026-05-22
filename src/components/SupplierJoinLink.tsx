import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { ComponentProps, ReactNode } from "react";

type SupplierJoinLinkProps = {
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  children?: ReactNode;
};

export function SupplierJoinLink({
  className,
  variant,
  size,
  children = "انضم كمورد",
}: SupplierJoinLinkProps) {
  return (
    <Link href="/join-supplier">
      <Button type="button" variant={variant} size={size} className={className}>
        {children}
      </Button>
    </Link>
  );
}

export function SupplierJoinTextLink({ className }: { className?: string }) {
  return (
    <Link
      href="/join-supplier"
      className={className ?? "text-muted-foreground hover:text-primary transition-colors text-sm"}
    >
      انضم كمورد
    </Link>
  );
}
