"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAuth } from "@/_hooks";

export const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedOut = useMemo(() => !loading && !user, [user, loading]);

  useEffect(() => {
    if (isLoggedOut) router.push(`/join?redirect=${pathname}`);
  }, [isLoggedOut, router, pathname]);

  return <></>;
};
