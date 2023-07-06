"use client";
import { JSX } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface NavbarProps {
  buttons?: JSX.Element[];
  title?: string;
  onBackClicked?: () => void;
}

export default function Navbar({
  buttons,
  title,
  onBackClicked,
}: NavbarProps): JSX.Element {
  return (
    <div
      className={
        "fixed z-20 flex w-full items-center justify-between space-x-5 border-b bg-white/40 px-7 py-3 backdrop-blur-lg"
      }
    >
      <div className={"flex flex-row space-x-3"}>
        <span
          className={"h-7 w-7 cursor-pointer"}
          hidden={onBackClicked === undefined}
          onClick={() => {
            if (onBackClicked !== undefined) {
              onBackClicked();
            }
          }}
        >
          <ArrowLeftIcon />
        </span>
        <span className={"select-none text-xl font-bold"}>{title}</span>
      </div>
      <div className={"space-x-5"}>
        {buttons !== undefined ? buttons.map((btn) => btn) : null}
      </div>
    </div>
  );
}
