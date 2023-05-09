"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthError,
  TokenRequest,
  TokenResponse,
  isError,
  requestToken,
} from "./auth";
import { useAccount } from "./hooks";

interface AuthContextProps {
  authenticate: (req: TokenRequest) => Promise<TokenResponse | AuthError>;
  status: "authenticating" | "authenticated" | "unauthenticated" | null;
  logout: () => void;
  justLoggedOut: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const { refetch } = useAccount();
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [status, setStatus] = useState<AuthContextProps["status"]>(null);

  const authenticate = useCallback(async (req: TokenRequest) => {
    if (!localStorage.getItem("access_token")) setAuthenticating(true);
    const res = await requestToken(req);
    if (!isError(res)) {
      localStorage.setItem("access_token", res.access_token);
      if (res.refresh_token)
        localStorage.setItem("refresh_token", res.refresh_token);
    }
    setAuthenticating(false);
    return res;
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setJustLoggedOut(true);
    refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        authenticate,
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
