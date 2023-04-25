import "./globals.css";
import { FunctionComponent, ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Skolorna",
};

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <QueryProvider>
    <html lang="sv" className={`${inter.variable} font-sans`}>
      <body>{children}</body>
    </html>
  </QueryProvider>
);

export default RootLayout;
