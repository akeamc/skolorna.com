"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useLocalStorage from "../useLocalStorage";
import { decodeJwt } from "jose";
import {
  AuthError,
  TokenRequest,
  TokenResponse,
  isError,
  requestToken,
} from "./auth";

interface AuthContextProps {
  authenticate: (req: TokenRequest) => Promise<TokenResponse | AuthError>;
  status: "authenticating" | "authenticated" | "unauthenticated" | null;
  accessToken: string | null;
  logout: () => void;
  justLoggedOut: boolean;
  userId: string | null;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh_token", "");
  const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const { exp = 0, sub } = useMemo(() => {
    if (!accessToken) return { exp: null, sub: null };
    return decodeJwt(accessToken);
  }, [accessToken]);

  const authenticate = useCallback(
    async (req: TokenRequest) => {
      if (!accessToken) setAuthenticating(true);
      const res = await requestToken(req);
      if (!isError(res)) {
        setAccessToken(res.access_token);
        if (res.refresh_token) setRefreshToken(res.refresh_token);
      }
      setAuthenticating(false);
      return res;
    },
    [accessToken, setAccessToken, setRefreshToken]
  );

  useEffect(() => {
    if (!exp) return;
    const delay = exp * 1000 - new Date().getTime() - 1000 * 60;

    const timeout = setTimeout(() => {
      if (!refreshToken) {
        return setAccessToken("");
      }

      authenticate({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [exp, authenticate, refreshToken, setAccessToken]);

  let status: AuthContextProps["status"] = null;
  if (accessToken) status = "authenticated";
  else if (authenticating) status = "authenticating";
  else if (typeof accessToken !== "undefined") status = "unauthenticated";

  const logout = useCallback(() => {
    setAccessToken("");
    setRefreshToken("");
    setJustLoggedOut(true);
  }, [setAccessToken, setRefreshToken]);

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        status,
        accessToken: accessToken || null,
        logout,
        justLoggedOut,
        userId: sub || null,
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
