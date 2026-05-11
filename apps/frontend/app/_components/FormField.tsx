import classNames from "classnames";
import React from "react";

type FormFieldProps = {
  className?: string;
  inputClassName?: string;
  error?: string;
  label?: string;
  name: string;
  onChange: React.ChangeEventHandler<any>;
  onBlur?: (e: React.FocusEvent<any>) => void;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value: string;
};

export const FormField = ({
  className,
  inputClassName,
  error,
  label,
  name,
  onChange,
  placeholder,
  required,
  type,
  value,
}: FormFieldProps) => {
  const Component = type === "textarea" ? "textarea" : "input";

  return (
    <div className={classNames("flex-col gap-[2px]", className)}>
      <div className="flex gap-[10px] w-full h-full">
        {label && <label htmlFor={name}>{label}</label>}
        <Component
          className={classNames(
            "p-[3px] pl-[5px] border border-1 border-[#ddd] font-mono text-left align-top w-full border-secondary-500",
            "bg-background-500",
            inputClassName,
          )}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red text-[10px]">{error}</p>}
    </div>
  );
};
