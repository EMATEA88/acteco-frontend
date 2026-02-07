import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const isAuthenticated = !!token;

  function login(newToken: string) {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
