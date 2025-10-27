import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Providers from "@/app/providers";
import NextTopLoader from "nextjs-toploader";
import { DialogProvider } from "@/components/providers/dialog-provider";
import SearchDialog from "@/components/search/search-dialog";
import Footer from "@/components/footer";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-sofia-sans",
});

export const metadata: Metadata = {
  title: "Deadlock Tracker",
  description: "Your source for Deadlock stats, builds, and meta insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sofiaSans.className} antialiased`}>
        <Providers>
          <DialogProvider>
            <NextTopLoader showSpinner={false} color="#7877C6" />
            <Navbar />
            <div className="fixed left-0 top-0 z-[-10] h-full w-full">
              <div className="absolute top-0 z-[-2] h-screen w-screen bg-blk-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            </div>
            {children}
            <Footer/>
            <SearchDialog />
          </DialogProvider>
        </Providers>
      </body>
    </html>
  );
}
