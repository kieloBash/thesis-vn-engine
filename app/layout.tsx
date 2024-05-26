import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/global/sidebar";
import SidebarProvider from "@/providers/sidebar";
import StoryProvider from "@/providers/story";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thesis: Visual Novel Engine",
  description: "Created by Thesis Students of De La Salle University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <StoryProvider>
            <main className="min-h-screen w-full flex bg-white">
              <Sidebar />
              {children}
            </main>
          </StoryProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
