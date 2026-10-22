"use client";
import { useEffect, useRef } from "react";

// Phones and slow connections get the light 720p cut; wide screens upgrade to 1080p before playback.
export default function Film() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType || "");
    if (innerWidth >= 900 && !slow) { v.src = "/media/hackios-film-v3.mp4"; v.load(); }
  }, []);
  return (
    <video ref={ref} controls playsInline preload="metadata" poster="/media/hackios-film-poster-v3.jpg">
      <source src="/media/hackios-film-v3-720.mp4" type="video/mp4" />
    </video>
  );
}
