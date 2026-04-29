import React from "react";

type FormFieldProps = {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean
  value: string;
}

export const FormField = ({
  label,
  name,
  onChange,
  required,
  type,
  value,
}: FormFieldProps) => (
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
)
