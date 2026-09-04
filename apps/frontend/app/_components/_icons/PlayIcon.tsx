import { faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useMemo } from "react";

import { IconWrapper } from "./IconWrapper";

import type { IconArgs } from "./types";
import type { PlayState } from "@/_types";

type PlayIconProps = {
  state: PlayState;
} & IconArgs;

export const PlayIcon = ({ className, onClick, state }: PlayIconProps) => {
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
          "animate-spin": state === "loading",
        })}
        onClick={onClick}
      />
    </IconWrapper>
  );
};
