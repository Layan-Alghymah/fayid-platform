import { createContext, useContext, type ReactNode } from "react";
import { useGetMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react.schemas";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminAuthContextType {
  adminUser: User | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Manages admin authentication state independently from the public user auth flow.
 *
 * Currently backed by the main platform JWT (user.role === "admin").
 *
 * REAL AUTH SWAP POINTS — to add dedicated admin auth (2FA, separate service):
 *   1. Replace `useGetMe` with a `useGetAdminProfile` hook (separate endpoint)
 *   2. Store token under a separate key (e.g. "admin_token")
 *   3. Add `twoFactorVerified` flag to the isAdminAuthenticated check
 *   4. Replace the `useLogin` call in AdminLogin.tsx with a `useAdminLogin` hook
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // React Query deduplicates this call with the one in AuthProvider — no extra network request.
  const { data: user, isLoading } = useGetMe({
    query: { retry: false, refetchOnWindowFocus: false },
  });

  const isAdminAuthenticated = !!user && user.role === "admin";

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser: isAdminAuthenticated ? (user as User) : null,
        isAdminAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
