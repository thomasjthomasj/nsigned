import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/_components/Button";
import { post } from "@/_utils/api.client";

import type { Notification } from "@/_types/api";

type DropDownProps = {
  notifications: Notification[];
  loadNotifications: () => Promise<void>;
};

export const DropDown = ({
  notifications,
  loadNotifications,
}: DropDownProps) => {
  const router = useRouter();

  const markAsRead = useCallback(
    async (notificationIDs: number[]) => {
      await post({
        endpoint: "users/notifications/mark-read",
        data: {
          notification_ids: notificationIDs,
        },
        withAuth: true,
      });
      loadNotifications();
    },
    [loadNotifications],
  );

  const handleClick = useCallback(
    async (
      e: React.MouseEvent<HTMLAnchorElement>,
      notification: Notification,
    ) => {
      e.preventDefault();
      markAsRead([notification.id]);
      if (notification.link) router.push(notification.link);
    },
    [markAsRead, router],
  );

  const handleMarkAllRead = useCallback(async () => {
    await markAsRead(notifications.map((n) => n.id));
    router.refresh();
  }, [notifications, markAsRead, router]);

  return (
    <div className="flex flex-col p-[15px] bg-background border-1 border-tertiary-500 absolute right-0 w-[250px] sm:w-[300px]">
      <h3 className="w-full pb-[5px] border-b border-primary-500">
        Notifications
      </h3>
      {notifications.length === 0 ? (
        <p>You have no new notifications</p>
      ) : (
        <>
          {notifications.map((n, i) => (
            <a
              href={n.link ?? "#"}
              key={n.id}
              onClick={(e) => handleClick(e, n)}
              className="drop-down"
            >
              <div
                className={classNames("py-[15px] flex gap-[5px]", {
                  "border-b border-tertiary-500":
                    i < notifications.length - 1 && i % 2,
                  "border-b border-secondary-500":
                    i < notifications.length - 1 && !(i % 2),
                })}
              >
                <p className="font-bold !text-primary-500">//</p>
                <p>{n.text}</p>
              </div>
            </a>
          ))}
          <Button onClick={handleMarkAllRead} label="Mark all as read" />
        </>
      )}
    </div>
  );
};
