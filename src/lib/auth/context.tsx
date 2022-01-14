import React, { createContext, FunctionComponent, useContext } from "react";
import useSWR from "swr";
import { auth, LoginUser, RegisterUser, User } from "./client";

export interface AuthContextData {
  /**
   * The currently logged in user, or `null` if nobody is logged in.
   *
   * This value is undefiend on the first few renders, because a network
   * request is needed in order to determine whether someone is logged in.
   */
  user?: User | null;
  unauthenticated?: boolean;
  logout: () => Promise<void>;
  login: (credentials: LoginUser) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  logout: async () => {},
  login: async () => {},
  register: async () => {},
});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const { data: user, revalidate } = useSWR<User | null>("/users/@me", () =>
    auth.me()
  );

  async function logout() {
    await auth.logout();
    await revalidate();
  }

  async function login(credentials: LoginUser) {
    await auth.logout();
    await auth.login(credentials);
    await revalidate();
  }

  async function register(data: RegisterUser) {
    await auth.logout();
    await auth.register(data);
    await revalidate();
  }

  return (
    <AuthContext.Provider
      value={{ user, unauthenticated: user === null, logout, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
