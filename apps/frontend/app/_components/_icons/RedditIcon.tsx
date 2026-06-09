import { faReddit } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

export const RedditIcon = ({ className, onClick }: IconArgs) => (
  <IconWrapper>
    <FontAwesomeIcon icon={faReddit} className={className} onClick={onClick} />
  </IconWrapper>
);
