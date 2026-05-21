import { createContext, useContext, type ReactNode } from "react";

interface AdminAuthContextType {
  adminUser: null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

/**
 * Admin auth — coming soon.
 * For now, no admin user is available.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AdminAuthContext.Provider
      value={{
        adminUser: null,
        isAdminAuthenticated: false,
        isLoading: false,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
