"use client"

import { CookiesProvider as BaseCookiesProvider } from "react-cookie";

type CookiesProviderProps = {
  children: React.ReactNode;
}

export const CookiesProvider = ({ children }: CookiesProviderProps) => (
  <BaseCookiesProvider>
    {children}
  </BaseCookiesProvider>
)
