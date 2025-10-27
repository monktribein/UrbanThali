import "./globals.css";
import { Metadata } from "next";
import "/public/assets/css/custom.css";
import 'react-toastify/dist/ReactToastify.css';
import { Poppins } from "next/font/google";
import { Providers } from "@/redux/provider";

export const metadata: Metadata = {
  title: "Urban Thali - Restaurant Admin Panel",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  shrinkToFit: false, // optional, replaces shrink-to-fit=no
};

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
