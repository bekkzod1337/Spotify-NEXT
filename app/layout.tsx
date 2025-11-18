import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "./context/MusicContext";
import MusicPlayer from "./components/MusicPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎵 Aura - Professional Music Player",
  description: "Spotify-style music player with playlists, liked songs, and more. Professional-grade music streaming experience.",
  keywords: ["music player", "spotify", "playlists", "streaming", "audio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#1DB954" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%231DB954'/><path d='M50 25v50M35 40v30M65 35v40' stroke='black' stroke-width='4' stroke-linecap='round'/></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <MusicProvider>
          <div className="w-full min-h-screen">
            {children}
          </div>
          <MusicPlayer />
        </MusicProvider>
      </body>
    </html>
  );
}
