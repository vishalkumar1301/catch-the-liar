import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catch the liars",
  description: "Track and expose lies through tweets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          defer
          data-website-id="673a8e58acf2c3130a5d35d9"
          data-domain="catchtheliars.com"
          src="https://datafa.st/js/script.js"
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header />
          <div className="container px-4 mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
