import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/providers";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/shared/dark-mode";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin CRM Login",
  description: "Welcome to Admin CRM Login",
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Providers>
          <ToastProvider />
          <body className={`${inter.className} antialiased`}>{children}</body>
        </Providers>
      </ThemeProvider>
    </html>
  );
};

export default AdminLayout;
