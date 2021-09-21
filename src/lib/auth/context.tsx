import React, { createContext, FunctionComponent, useContext } from "react";
import useStickyState from "../utils/persisted-state";
import { User } from "./api";

interface ContextData {
  user: User | undefined;
  setUser: (u: User | undefined) => void;
  refreshToken: string | undefined;
  setRefreshToken: (t: string | undefined) => void;
  accessToken: string | undefined;
  setAccessToken: (t: string | undefined) => void;
}

const AuthContext = createContext<ContextData>({
  user: undefined,
  setUser: () => {},
  refreshToken: undefined,
  setRefreshToken: () => {},
  accessToken: undefined,
  setAccessToken: () => {},
});

const AuthProvider: FunctionComponent = ({ children }) => {
  const [refreshToken, setRefreshToken] = useStickyState<string | undefined>(
    "refresh_token"
  );
  const [accessToken, setAccessToken] = useStickyState<string | undefined>(
    "access_token"
  );

  return (
    <AuthContext.Provider
      value={{
        user: undefined,
        setUser: () => {},
        refreshToken,
        setRefreshToken,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
