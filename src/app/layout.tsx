import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = headers();
  const forwardedProto = headerList.get("x-forwarded-proto") ?? "http";
  const forwardedHost = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || "https://sbfirodiya.dev";
  const baseUrl = envBase && envBase.startsWith("http") ? envBase : `${forwardedProto}://${forwardedHost}`;

  const absoluteOg = `${baseUrl}/og.png`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Shivani Firodiya | Full Stack Developer",
      template: "%s | Shivani Firodiya",
    },
    applicationName: "Shivani Firodiya's Portfolio",
    description:
      "Full Stack Developer & Software Engineer. Bringing ideas to reality with cutting-edge technology.",
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
      url: baseUrl,
      images: [
        {
          url: absoluteOg,
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
      images: [absoluteOg],
    },
    themeColor: "#5C7A5C",
    manifest: "/icon/site.webmanifest",
    icons: {
      icon: [
        { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/icon/apple-touch-icon.png",
      shortcut: "/icon/favicon.ico",
    },
    alternates: {
      canonical: baseUrl,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
  };
}

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

