import React from "react";

type FormFieldProps = {
  error?: string;
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  value: string;
};

export const FormField = ({
  error,
  label,
  name,
  onChange,
  required,
  type,
  value,
}: FormFieldProps) => (
  <div className="flex-col gap-[2px]">
    <div className="flex gap-[10px]">
      <label htmlFor={name}>{label}</label>
      <input
        className="p-[3px] border border-1 border-[#ddd]"
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
      />
    </div>
    {error && <p className="text-red text-[10px]">{error}</p>}
  </div>
);
