"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./context";
import { ComponentType, FunctionComponent, useEffect } from "react";

export default function withAuth<P extends JSX.IntrinsicAttributes = {}>(
  Component: ComponentType<P>
): FunctionComponent<P> {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [router, status]);

    if (status === "authenticated") {
      return <Component {...props} />;
    }

    return null;
  };
}
