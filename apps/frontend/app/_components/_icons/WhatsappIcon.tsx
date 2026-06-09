import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

export const WhatsappIcon = ({ className, onClick }: IconArgs) => (
  <IconWrapper>
    <FontAwesomeIcon
      icon={faWhatsapp}
      className={className}
      onClick={onClick}
    />
  </IconWrapper>
);
