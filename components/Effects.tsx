"use client";
import { useEffect } from "react";

const GL = "!<>-_\\/[]{}=+*^?#01ABCDEFXZ";

// Page-wide motion: headings decode once when they enter view, blocks below the fold drift in.
// Everything starts readable; nothing waits at opacity 0 if JS never runs.
export default function Effects() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?still turns motion off, handy for screenshots and previews
    if (reduce || location.search.includes("still")) return;
    const scramble = (el: HTMLElement) => {
      const fin = el.dataset.final || el.textContent || ""; el.dataset.final = fin;
      let f = 0; const total = 24;
      const run = () => {
        const k = f / total;
        el.textContent = [...fin].map((c, i) => (c === " " || i / fin.length < k ? c : GL[(Math.random() * GL.length) | 0])).join("");
        if (f++ < total) requestAnimationFrame(run); else el.textContent = fin;
      };
      run();
    };
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target as HTMLElement); so.unobserve(e.target); } }), { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => so.observe(el));
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove("pending"); ro.unobserve(e.target); } }), { threshold: 0.1 });
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pending"); ro.observe(el); }
    });
    return () => { so.disconnect(); ro.disconnect(); };
  }, []);
  return null;
}
