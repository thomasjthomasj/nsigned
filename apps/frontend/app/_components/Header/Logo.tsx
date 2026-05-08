"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const Logo = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (pathname === "/") {
        router.refresh();
      } else {
        router.push("/");
      }
    },
    [router, pathname],
  );

  return (
    <div>
      <h1>
        <a href="/" onClick={handleClick}>
          _nsigned
        </a>
      </h1>
    </div>
  );
};
