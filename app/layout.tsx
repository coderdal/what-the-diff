import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatTheDiff – Code & Text Diff Checker",
  description:
    "Compare, diff, and merge code or text instantly. Syntax highlighting, split & unified views, shareable links. All processing happens in your browser — 100% private.",
  keywords: ["diff checker", "code diff", "text compare", "merge tool", "diff viewer"],
  openGraph: {
    title: "WhatTheDiff",
    description: "Compare, diff, and merge code or text instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('wtd-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
