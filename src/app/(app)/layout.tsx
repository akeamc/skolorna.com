import Header from "@/components/Header";
import GoogleIdPrompt from "@/components/auth/GoogleIdPrompt";
import { PropsWithChildren } from "react";

export default function DefaultLayout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <GoogleIdPrompt />
      {children}
    </>
  );
}
