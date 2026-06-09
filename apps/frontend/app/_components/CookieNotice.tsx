"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { Button } from "@/_components/Button";

const COOKIE_NAME = "nsigned-cookie-consent-v2";
const { GA_TAG } = process.env;

export const CookieNotice = () => {
  const [cookies, setCookie] = useCookies([COOKIE_NAME]);
  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [canTrack, setCanTrack] = useState<boolean>(false);

  useEffect(() => {
    setShowNotice(!cookies[COOKIE_NAME]);
    setCanTrack(cookies[COOKIE_NAME] === "true");
  }, [cookies]);

  const handleAccept = useCallback(() => {
    setCookie(COOKIE_NAME, "true", { path: "/", maxAge: 31536000 });
    setShowNotice(false);
  }, []);

  const handleReject = useCallback(() => {
    setCookie(COOKIE_NAME, "false", { path: "/", maxAge: 31536000 });
    setShowNotice(false);
  }, []);

  if (canTrack)
    return (
      <>
        <Analytics />
        {GA_TAG && <GoogleAnalytics gaId={GA_TAG} />}
      </>
    );

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-0 bg-background-500 border border-tertiary-500 p-3 flex items-center">
      <div className="flex flex-col items-center gap-[8px]">
        <p className="w-[80%]">
          This site uses{" "}
          <a href="https://vercel.com/docs/analytics" target="_blank">
            Vercel analytics
          </a>{" "}
          and{" "}
          <a
            href="https://support.google.com/analytics/topic/14089939"
            target="_blank"
          >
            Google Analytics
          </a>{" "}
          to track page views, as well as basic information such as how you got
          here, what browser you are using, and whether or not you are on
          mobile. No personal information is collected or sold.
        </p>
        <div className="flex gap-[8px]">
          <Button onClick={handleAccept} label="Accept" />
          <Button onClick={handleReject} label="Reject" />
        </div>
      </div>
    </div>
  );
};
