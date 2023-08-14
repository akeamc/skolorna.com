"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as auth from "./auth";
import { useAccount } from "./hooks";

interface AuthContextProps {
  login: (
    req: auth.LoginRequest
  ) => Promise<auth.LoginSuccess | auth.AuthError>;
  status: "authenticating" | "authenticated" | "unauthenticated" | null;
  logout: () => Promise<void>;
  justLoggedOut: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const { data: account, isSuccess, refetch } = useAccount();
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [status, setStatus] = useState<AuthContextProps["status"]>(null);

  const login = useCallback(
    async (req: auth.LoginRequest) => {
      setAuthenticating(true);
      const res = await auth.login(req);
      setAuthenticating(false);
      setStatus("authenticated");
      refetch();
      return res;
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    await auth.logout();
    setStatus("unauthenticated");
    setJustLoggedOut(true);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isSuccess) return;
    if (account) {
      setStatus("authenticated");
      setJustLoggedOut(false);
    } else {
      setStatus("unauthenticated");
    }
  }, [account, isSuccess]);

  return (
    <AuthContext.Provider
      value={{
        login,
        status:
          authenticating && status !== "authenticated"
            ? "authenticating"
            : status,
        logout,
        justLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
