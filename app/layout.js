import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Head from "next/head";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SecurePass",
  description: "Generated to save passwords",
  icons: {
    icon: "/favicon.png", // path to your .png favicon in public
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <title>SecurePass</title>
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      <SpeedInsights />
      </html>
    </ClerkProvider>
  );
}
?
