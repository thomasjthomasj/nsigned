import classNames from "classnames";

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

export const Button = ({ className, disabled, label, onClick }: ButtonProps) => (
  <button
    className={classNames(
      "p-[5px] border border-1 border-[#eee]",
      {
        "cursor-pointer": !disabled,
        "bg-[#eee] text-[#aaa] cursor-not-allowed": disabled,
      },
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
)
