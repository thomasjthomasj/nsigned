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
      "p-[5px] font-mono rounded-sm border border-1",
      {
        "bg-primary-500 hover:bg-primary-700 active:bg-primary-700 border-primary-700 cursor-pointer":
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
