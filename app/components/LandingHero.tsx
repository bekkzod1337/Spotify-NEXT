"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const MusicPlayer = dynamic(() => import("./MusicPlayer"), { ssr: false });

export default function LandingHero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/Background.png"
        alt="Background"
        fill
        className="absolute inset-0 -z-30 object-cover"
        priority
      />

      {/* Video blended — removes black parts */}
      <video
        className="
          absolute inset-0 -z-20 w-full h-full object-cover
          mix-blend-screen opacity-90 pointer-events-none
        "
        src="/1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/40" />

      {/* Only Music Player */}
      <div className="w-[500px]">
        <div className="flex justify-center md:justify-end">
          <MusicPlayer />
        </div>
      </div>
    </section>
  );
}
