import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

export const CopyIcon = ({ className, onClick }: IconArgs) => (
  <IconWrapper>
    <FontAwesomeIcon icon={faCopy} className={className} onClick={onClick} />
  </IconWrapper>
);
