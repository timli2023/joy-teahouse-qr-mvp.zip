import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Joy Teahouse | QR Ordering",
  description: "Joy Teahouse multilingual QR ordering"
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
