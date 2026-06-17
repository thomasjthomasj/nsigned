import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

type BookmarkArgs = IconArgs & { bookmarked: boolean };

export const BookmarkIcon = ({
  className,
  onClick,
  bookmarked,
}: BookmarkArgs) => (
  <IconWrapper>
    <FontAwesomeIcon
      icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
      className={className}
      onClick={onClick}
    />
  </IconWrapper>
);
