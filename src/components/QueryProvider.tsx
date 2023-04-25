"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FunctionComponent, ReactNode } from "react";

const client = new QueryClient();

const QueryProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

export default QueryProvider;
