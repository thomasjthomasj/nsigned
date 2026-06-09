import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

export const FacebookIcon = ({ className, onClick }: IconArgs) => (
  <IconWrapper>
    <FontAwesomeIcon
      icon={faFacebook}
      className={className}
      onClick={onClick}
    />
  </IconWrapper>
);
