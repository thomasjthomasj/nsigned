import { faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";

type EnvelopeIconProps = {
  open: boolean;
} & IconArgs;

export const EnvelopeIcon = ({
  className,
  onClick,
  open,
}: EnvelopeIconProps) => (
  <IconWrapper>
    <FontAwesomeIcon
      icon={open ? faEnvelopeOpen : faEnvelope}
      className={className}
      onClick={onClick}
    />
  </IconWrapper>
);
