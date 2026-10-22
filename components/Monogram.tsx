"use client";
import { useEffect, useRef } from "react";

const GLYPH: Record<string, string> = {
  N: "10001 11001 10101 10011 10001 10001 10001",
  W: "10001 10001 10001 10101 10101 10101 01010",
  H: "10001 10001 10001 11111 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
};

// The first letter of a handle, drawn as a lit LED matrix.
export default function Monogram({ letter, seed }: { letter: string; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const draw = () => {
      const d = Math.min(devicePixelRatio || 1, 2), s = cv.clientWidth || 260;
      cv.width = s * d; cv.height = s * d;
      const g = cv.getContext("2d")!; g.scale(d, d);
      const rows = (GLYPH[letter] || GLYPH.O).split(" "), cols = 9, pitch = s / cols, ox = 2, oy = 1;
      for (let y = 0; y < cols; y++) for (let x = 0; x < cols; x++) {
        const gx = x - ox, gy = y - oy;
        const on = gy >= 0 && gy < 7 && gx >= 0 && gx < 5 && rows[gy][gx] === "1";
        const shade = 0.55 + 0.45 * Math.sin(x * 1.7 + y * 1.1 + seed);
        g.beginPath(); g.arc((x + 0.5) * pitch, (y + 0.5) * pitch, on ? pitch * 0.4 : pitch * 0.09, 0, Math.PI * 2);
        g.fillStyle = on ? `rgb(${(200 + 55 * shade) | 0},${(16 + 18 * shade) | 0},${(10 + 10 * shade) | 0})` : "rgba(70,34,30,.8)";
        g.shadowColor = "rgba(232,23,15,.7)"; g.shadowBlur = on ? pitch * 0.5 : 0;
        g.fill();
      }
    };
    draw();
    const ro = new ResizeObserver(draw); ro.observe(cv);
    return () => ro.disconnect();
  }, [letter, seed]);
  return <canvas ref={ref} aria-hidden="true" />;
}
