import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import TanstackProvider from "@/providers/tanstack";
import { NotificationProvider } from "@/components/context/notification-context";

export const metadata: Metadata = {
  title: "ElectWasm",
  description: "A new way to vote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`font-mono antialiased`}
      >
        <TanstackProvider>
          <Navbar />
          <NotificationProvider>{children}</NotificationProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
