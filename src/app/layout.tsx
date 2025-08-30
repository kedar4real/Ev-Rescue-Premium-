import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Sidebar } from "../components/ui/sidebar";
import { NotificationContainer } from "../components/ui/notification";
import { SidebarProvider } from "../components/providers/SidebarProvider";
import { AuthProvider } from "../components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Rescue Premium",
  description: "Emergency EV charging services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased emergency-bg`}
      >
        <AuthProvider>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar - always visible on desktop */}
              <Sidebar />
              {/* Main content area */}
              <div className="flex-1 flex flex-col min-w-0 relative">
                <Header />
                <main className="flex-1 overflow-auto p-4">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
        <NotificationContainer />
      </body>
    </html>
  );
}
