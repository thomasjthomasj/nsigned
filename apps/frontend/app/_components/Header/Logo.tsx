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
      <h1 className="text-[20px] font-mono cursor-pointer">
        <a href="/" onClick={handleClick}>
          *nsigned
        </a>
      </h1>
    </div>
  );
};
