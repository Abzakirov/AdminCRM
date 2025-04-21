import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/providers";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin CRM Login",
  description: "Welcome to Admin CRM Login",
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <ToastProvider />
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </Providers>
  );
};

export default AdminLayout;
