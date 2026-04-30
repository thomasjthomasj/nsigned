"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "@/_utils/api.client";

import type { LoggedInUser as User } from "@/_types/api/users";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUser = async () => {
    const response = await getMe();
    if (response.ok) {
      setUser(response.data);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      await getUser();
      setLoading(false);
    };
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
