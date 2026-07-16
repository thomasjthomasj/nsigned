import classNames from "classnames";
import { useMemo } from "react";
import { faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconWrapper } from "./IconWrapper";

import type { PlayStatus } from "@/_types";
import type { IconArgs } from "./types";

type PlayIconProps = {
  state: PlayStatus;
} & IconArgs;

export const PlayIcon = ({
  className,
  onClick,
  state
}: PlayIconProps) => {
  const icon = useMemo(() => {
    if (state === "playing") return faPause;
    if (state === "paused") return faPlay;
    return faSpinner;
  }, [state]);

  return (
    <IconWrapper>
      <FontAwesomeIcon
        icon={icon}
        className={classNames(className, {
          "animate-spin": state === "loading"
        })}
        onClick={onClick}
      />
    </IconWrapper>
  )
}
