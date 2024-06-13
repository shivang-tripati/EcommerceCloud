import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
// import { Toaster } from "react-hot-toast"

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-proviers";
import { ModalProvider } from "@/providers/modal-providers";
import { ToastProvider } from "@/providers/toast-provider";




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcommerceCloud",
  description: "Empower Your Online Store with Seamless Content Management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class"  defaultTheme="system" enableSystem>
        <ToastProvider/>
        <ModalProvider/>
        {children}  
        </ThemeProvider>  
      </body>
    </html>
    </ClerkProvider>
    
  );
}
