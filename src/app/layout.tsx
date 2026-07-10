import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "rocketgoal-name-tools",
  description: "Custom name styling tools for rocketgoal.io. By mhmmmm000000.",
  keywords: ["rocketgoal", "rocketgoal.io", "name tools"],
  authors: [{ name: "mhmmmm000000" }],
  openGraph: {
    title: "rocketgoal-name-tools",
    description: "Custom name styling for rocketgoal.io. By mhmmmm000000.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rocketgoal-name-tools",
    description: "Custom name styling for rocketgoal.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
