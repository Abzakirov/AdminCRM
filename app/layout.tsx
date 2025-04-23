import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "700"],
});
export const metadata: Metadata = {
  title: "Admin CRM",
  description: "Welcome to Admin CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
