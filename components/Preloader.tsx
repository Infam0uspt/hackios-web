"use client";
import { useEffect, useRef, useState } from "react";

const LOG = ["> boot hackios", "> load oosy.led  <b>ok</b>", "> link t.me/oosexgangdevs  <b>ok</b>", "> status: experimental", "> oosy.wake()"];

// Shown once per browser session. Server-rendered visible, with a CSS fallback that hides it after 5s.
export default function Preloader({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const num = useRef<HTMLSpanElement>(null), bar = useRef<HTMLDivElement>(null), log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("hk-pre") === "1"; sessionStorage.setItem("hk-pre", "1"); } catch {}
    if (seen || location.search.includes("still") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true); document.documentElement.classList.add("ready"); return;
    }
    const t0 = performance.now(), dur = 1400; let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - t0) / dur)), v = Math.round((1 - Math.pow(1 - k, 3)) * 100);
      if (num.current) num.current.textContent = String(v);
      if (bar.current) bar.current.style.width = v + "%";
      if (log.current) log.current.innerHTML = LOG.slice(0, Math.ceil(k * LOG.length)).join("\n");
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setDone(true); document.documentElement.classList.add("ready"); }, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  // drop the fixed layer once it has faded out
  useEffect(() => { if (done) { const id = setTimeout(() => setGone(true), 700); return () => clearTimeout(id); } }, [done]);
  if (gone) return null;
  return (
    <div className={`pre${done ? " done" : ""}`} aria-hidden="true">
      <div className="pre-bar" ref={bar} />
      <div className="pre-log" ref={log} />
      <div>
        <div className="pre-num"><span ref={num}>0</span>%</div>
        <div className="pre-row label"><span className="dot pre-loading">{label}</span><span>HACKiOS · OOSEX GANG</span></div>
      </div>
    </div>
  );
}
