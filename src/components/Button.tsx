import { JSX } from "react";

interface ButtonProps {
  icon: JSX.Element;
  type?: "primary" | "danger" | "tertiary";
  disabled?: boolean;
  onClick: () => void;
}

export default function Button({
  icon,
  disabled = false,
  type = "primary",
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={`rounded-md ${
        type === "danger"
          ? "bg-red-600 text-white hover:bg-red-700"
          : type === "tertiary"
          ? "bg-gray-200 text-black hover:bg-gray-200"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }  p-1  disabled:bg-gray-300 disabled:text-gray-400 hover:disabled:bg-gray-300`}
      onClick={onClick}
    >
      <div className={"h-7 w-7"}>{icon}</div>
    </button>
  );
}
