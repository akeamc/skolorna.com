import "./globals.css";
import { FunctionComponent, ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/lib/auth/context";
import Header from "@/components/Header";
import { GoogleProvider } from "@/components/auth/GoogleContext";
import GoogleIdPrompt from "@/components/auth/GoogleIdPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Skolorna",
};

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <QueryProvider>
    <AuthProvider>
      <GoogleProvider>
        <html lang="sv" className={`${inter.variable} font-sans`}>
          <body>
            <Header />
            <GoogleIdPrompt />
            {children}
          </body>
        </html>
      </GoogleProvider>
    </AuthProvider>
  </QueryProvider>
);

export default RootLayout;
