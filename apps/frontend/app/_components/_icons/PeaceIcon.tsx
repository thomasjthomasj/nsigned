import { faHandPeace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

export const PeaceIcon = ({ className, onClick }: IconArgs) => (
  <IconWrapper>
    <FontAwesomeIcon
      icon={faHandPeace}
      className={className}
      onClick={onClick}
    />
  </IconWrapper>
);
