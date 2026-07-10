import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "RocketGoal Name Tools — Custom styled names for rocketgoal.io",
  description: "Style your rocketgoal.io in-game name with curves, gradients, and promo text. 20+ styles, encrypted scripts, verified unlock. By mhmmmm000000.",
  keywords: ["rocketgoal", "rocketgoal.io", "name tools", "custom name", "gradient name"],
  authors: [{ name: "mhmmmm000000" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "RocketGoal Name Tools",
    description: "Custom styled names for rocketgoal.io. By mhmmmm000000.",
    type: "website",
    url: "https://rocketgoal-name-toolss.netlify.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketGoal Name Tools",
    description: "Custom styled names for rocketgoal.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
