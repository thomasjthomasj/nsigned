import classNames from "classnames";

import { nodeToString } from "@/_utils/text";

type ButtonProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export const Button = ({
  ariaLabel,
  className,
  disabled,
  label,
  onClick,
  type = "button",
}: ButtonProps) => (
  <button
    className={classNames(
      "p-[5px] font-mono rounded-sm font-bold",
      {
        "bg-primary-500 hover:bg-primary-300 active:bg-primary-300 cursor-pointer":
          !disabled,
        "bg-disabled-500 hover:bg-disabled-500 border-disabled-800 text-disabled-800 cursor-not-allowed":
          disabled,
      },
      className,
    )}
    aria-label={ariaLabel ?? nodeToString(label)}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
