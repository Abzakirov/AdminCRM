import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import "@ant-design/v5-patch-for-react-19";
import Header from "@/components/header/Header";
import { ThemeProvider } from "@/shared/dark-mode";

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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <main className="flex">
          <Sidebar />
          <div className="w-full">
            <Header />
            {children}
          </div>
         
        </main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
