import classNames from "classnames";

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
};

export const Button = ({
  className,
  disabled,
  label,
  onClick,
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
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
