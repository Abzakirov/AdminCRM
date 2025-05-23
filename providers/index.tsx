"use client";
import { ChildrenType } from "@/@types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const Providers = ({ children }: ChildrenType) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
