import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react.schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem("auth_token");
        queryClient.setQueryData([`/api/auth/me`], null);
        queryClient.clear();
        setLocation("/");
        toast({
          title: "تم تسجيل الخروج",
          description: "نراك قريباً!",
        });
      }
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
