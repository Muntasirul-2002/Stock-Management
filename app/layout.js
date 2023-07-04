import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stock Management Admin ",
  description:
    "This is an stock management web application where you can update your products as well as manage your stock with minus plus buttons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link
        rel="shortcut icon"
        href="https://cdn.iconscout.com/icon/premium/png-512-thumb/inventory-management-2306355-1953317.png?f=avif&w=512"
        type="image/x-icon"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
