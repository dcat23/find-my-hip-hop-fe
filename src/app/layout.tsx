import "@dcat23/styles/globals.css";
import { cal, inter } from "@dcat23/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@dcat23/lib/utils";

const title =
  "Find My Hip Hop – The all-in-one starter kit for building multi-tenant applications.";
const description =
  "The Find My Hip Hop is a full-stack Next.js app with multi-tenancy and custom domain support. Built with Next.js App Router, Vercel Postgres and the Vercel Domains API.";
const image = "https://dcat.tech/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://dcat.tech/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@dcat23",
  },
  metadataBase: new URL("https://dcat.tech"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
