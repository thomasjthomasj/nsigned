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
        window.location.reload();
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
          <span className="text-primary-300">_</span>n
          <span className="max-[450px]:hidden inline">signed</span>
        </a>
      </h1>
    </div>
  );
};
