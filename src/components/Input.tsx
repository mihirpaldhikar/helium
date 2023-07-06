import { JSX } from "react";

interface InputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  type: "text" | "number" | "email" | "password";
  onChange: (value: string) => void;
}

export default function Input({
  value,
  type,
  disabled,
  placeholder,
  onChange,
}: InputProps): JSX.Element {
  return (
    <input
      disabled={disabled}
      type={type}
      placeholder={placeholder}
      value={value}
      className={
        "rounded-md border-2 border-gray-300 p-1 outline-none ring-0 focus:border-blue-400"
      }
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
