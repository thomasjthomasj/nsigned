"use client";

import { useAuth } from "@/_hooks";

export const BandcampEmbed = () => {
  const { isPatreonTier } = useAuth();
  const canUse = isPatreonTier("supporter");

  if (!canUse) return null;

  return (
    <iframe
      style={{
        border: "0",
        width: "100%",
        height: "42px;",
      }}
      src="https://bandcamp.com/EmbeddedPlayer/track=2672663914/size=small/bgcol=ffffff/linkcol=0687f5/transparent=true/"
      seamless
    >
      <a href="https://godribbon.bandcamp.com/track/stfuumf">
        STFUUMF by GOD RIBBON
      </a>
    </iframe>
  );
};
