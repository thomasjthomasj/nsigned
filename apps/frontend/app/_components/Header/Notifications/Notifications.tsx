"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { EnvelopeIcon } from "@/_components/_icons/EnvelopeIcon";
import { useAuth } from "@/_hooks";
import { get } from "@/_utils/api.client";

import { DropDown } from "./DropDown";

import type { Notification } from "@/_types/api";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const { ok, data } = await get<Notification[]>({
      endpoint: "users/notifications",
      withAuth: true,
    });

    if (ok) setNotifications(data.filter((n) => n.user_id === user.id));
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, pathname]);

  if (notifications.length === 0) return null;

  return (
    <div className="relative w-fit" ref={ref}>
      <EnvelopeIcon
        className="text-tertiary-500 hover:text-primary-300 cursor-pointer text-[34px]"
        onClick={() => setIsOpen((prev) => !prev)}
        open={isOpen}
      />
      {isOpen && (
        <DropDown
          notifications={notifications}
          loadNotifications={loadNotifications}
        />
      )}
    </div>
  );
};
