import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Shivani Firodiya | Full Stack Developer",
    template: "%s | Shivani Firodiya",
  },
  applicationName: "FolioStream",
  description: "Full Stack Developer & Software Engineer. Bringing ideas to reality with cutting-edge technology.",
  keywords: [
    "Shivani Firodiya",
    "Full Stack Developer",
    "Software Engineer",
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind",
    "Portfolio",
  ],
  authors: [{ name: "Shivani Firodiya", url: "https://www.linkedin.com/in/sbfirodiya" }],
  creator: "Shivani Firodiya",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Shivani Firodiya",
    title: "Shivani Firodiya | Full Stack Developer",
    description: "Full Stack Developer & Software Engineer.",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shivani Firodiya Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivani Firodiya | Full Stack Developer",
    description: "Full Stack Developer & Software Engineer.",
    images: ["/og.png"],
  },
  themeColor: "#5C7A5C",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

