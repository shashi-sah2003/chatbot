import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import PageTransition from "../components/PageTransition";

export const metadata: Metadata = {
  title: "DTU ChatBot",
  description: "A chatbot for DTU students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#212121] h-screen flex flex-col">
        <div className="flex flex-col overflow-hidden  bg-[#212121]">	
          <nav className="sticky top-0 z-50 bg-[#212121] bg-opacity-90 p-0 backdrop-blur-md shadow-md">
            <Header />
          </nav>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "z-[9999]",
              style: { background: "#000000", color: "#ffffff" },
            }}
          />
        </div>
      </body>
    </html>
  );
}