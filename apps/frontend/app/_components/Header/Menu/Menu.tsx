"use client";

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MenuIcon } from "@/_components/_icons/MenuIcon";
import { useAuth } from "@/_hooks/use-auth";
import { post } from "@/_utils/api.client";

type MenuItem = {
  label: string;
  link: string;
  primary: boolean;
};

export const Menu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { user, getUser } = useAuth();

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const handleLogOut = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      await post({ endpoint: "users/logout" });
      await getUser();
    },
    [getUser],
  );

  const menuItems = useMemo(() => {
    const items: MenuItem[] = [];
    if (!user) {
      items.push({
        label: "Join",
        link: "/join",
        primary: true,
      });
      items.push({
        label: "Log in",
        link: "/login",
        primary: true,
      });
    } else {
      items.push({
        label: "Profile",
        link: "/profile",
        primary: true,
      });
      items.push({
        label: "My reviews",
        link: "/my-reviews",
        primary: true,
      });
    }
    items.push({
      label: "About _nsigned",
      link: "/about",
      primary: false,
    });
    items.push({
      label: "Editorial guide",
      link: "/editorial-guide",
      primary: false,
    });
    items.push({
      label: "FAQs",
      link: "/faq",
      primary: false,
    });
    items.push({
      label: "Terms and conditions",
      link: "/terms",
      primary: false,
    });

    return items;
  }, [user]);

  return (
    <div className="relative w-fit" ref={menuRef}>
      <MenuIcon
        className={classNames("text-[2rem] cursor-pointer", {
          "text-foreground hover:text-primary-300": !isOpen,
          "text-primary-300": isOpen,
        })}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="flex flex-col p-[15px] bg-background border-1 border-tertiary-500 absolute right-0 text-nowrap">
          {menuItems
            .filter((i) => i.primary)
            .map((i) => (
              <a
                key={i.label}
                className="text-foreground font-bold hover:underline hover:text-primary-300"
                href={i.link}
              >
                {i.label}
              </a>
            ))}
          <div className="w-full h-0 border-b-1 border-primary-500 my-[10px]" />
          {menuItems
            .filter((i) => !i.primary)
            .map((i) => (
              <a
                key={i.label}
                className="text-secondary-300 hover:underline hover:text-primary-300"
                href={i.link}
              >
                {i.label}
              </a>
            ))}
          {user && (
            <a
              className="text-secondary-300 hover:underline hover:text-primary-300 cursor-pointer"
              onClick={handleLogOut}
            >
              Log out
            </a>
          )}
        </div>
      )}
    </div>
  );
};
