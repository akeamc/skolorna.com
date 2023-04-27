import "./globals.css";
import { FunctionComponent, ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";
import BigSearch from "@/components/oden/BigSearch";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Skolorna",
};

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <QueryProvider>
    <html lang="sv" className={`${inter.variable} font-sans`}>
      <body>
        <header className="w-full">
          <div className="mx-auto max-w-screen-lg px-4">
            <BigSearch />
          </div>
        </header>
        {children}
      </body>
    </html>
  </QueryProvider>
);

export default RootLayout;
