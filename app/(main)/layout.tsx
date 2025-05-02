import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@ant-design/v5-patch-for-react-19";
import { ThemeProvider } from "@/shared/dark-mode";
import Providers from "@/providers";
import AdminShell from "@/components/adminShell/AdminShell";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin CRM Dashboard",
  description: "Welcome to Admin CRM Dashboard",
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:!bg-[#1f1f1f]`}>
        <ThemeProvider  
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ToastProvider/>
            <AdminShell>
              {children}
            </AdminShell>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
