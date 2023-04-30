import "./globals.css";
import { FunctionComponent, ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/lib/auth/context";
import GoogleId from "@/components/auth/GoogleId";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Skolorna",
};

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <QueryProvider>
    <AuthProvider>
      <html lang="sv" className={`${inter.variable} font-sans`}>
        <body>
          <Header />
          <GoogleId />
          {children}
        </body>
      </html>
    </AuthProvider>
  </QueryProvider>
);

export default RootLayout;
