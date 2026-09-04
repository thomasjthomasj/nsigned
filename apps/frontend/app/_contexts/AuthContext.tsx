"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";

import { getMe } from "@/_utils/api.client";

import type { LoggedInUser as User, PatreonTier } from "@/_types/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  getUser: () => Promise<void>;
  patreonTier: PatreonTier | null;
  isPatreonTier: (tier: PatreonTier) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

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
  };

  useEffect(() => {
    const loadUser = async () => {
      await getUser();
      setLoading(false);
    };
    loadUser();
  }, []);

  const isPatreonTier = useCallback(
    (tier: PatreonTier) => user?.patreon_tier === tier,
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        getUser,
        patreonTier: user?.patreon_tier ?? null,
        isPatreonTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
