import type { Metadata } from "next";
import "./globals.css";
// import Providers from "./providers";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TriggerX",
  description: "Automate Tasks Effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const stakeRegistryAddress =
    process.env.NEXT_PUBLIC_TRIGGER_GAS_REGISTRY_ADDRESS || "";
  return (
    <html lang="en">
      <head>{/* Other <head> content if needed */}</head>
      <body className={`antialiated font-actay`}>
        <Header />
        <main className="max-w-[1600px] w-[90%] mx-auto mt-[120px] sm:mt-[150px] lg:mt-[270px] min-h-[500px] relative z-40">
          {children}
        </main>
        <Footer />

        <div id="modal-root"></div>
      </body>
    </html>
  );
}
