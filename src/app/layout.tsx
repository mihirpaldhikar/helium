import "./globals.css";
import { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Helium",
  description: "Blog built with NextJS and Polaris.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
