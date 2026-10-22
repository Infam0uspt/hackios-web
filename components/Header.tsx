"use client";
import { useEffect, useState } from "react";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/locales";

type Props = {
  locale: Locale;
  github: string;
  telegram: string;
  labels: { menu: string; close: string; nav: Record<"about" | "film" | "team" | "press" | "token" | "faq", string> };
};

const GH_PATH =
  "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3";

export default function Header({ locale, github, telegram, labels }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);
  const remember = (l: Locale) => { document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`; };
  const nav = labels.nav;
  const items: [string, string][] = [["#about", nav.about], ["#film", nav.film], ["#team", nav.team], ["#press", nav.press], ["#token", nav.token], ["#faq", nav.faq]];

  return (
    <>
      <header className="hdr">
        <a className="logo" href="#top" aria-label="HackiOS">
          <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="23" r="13" fill="#e8170f" /><rect x="13.5" y="19" width="5" height="7" rx="2.5" fill="#0a0909" /><rect x="21.5" y="19" width="5" height="7" rx="2.5" fill="#0a0909" /><path d="M10.5 13.5 7 4.5l8 6.2M29.5 13.5 33 4.5l-8 6.2" fill="#e8170f" /><circle cx="7" cy="4.5" r="2.4" fill="#e8170f" /><circle cx="33" cy="4.5" r="2.4" fill="#e8170f" /></svg>
          <span>HACK<em>iOS</em></span>
        </a>
        <div className="hdr-r">
          <a className="gh-btn" href={github} target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={GH_PATH} /></svg>
            <b>GitHub</b>
          </a>
          <div className="langs" role="group" aria-label="Language">
            {LOCALES.map((l) => (
              <a key={l} href={`/${l}`} aria-current={l === locale ? "true" : undefined} onClick={() => remember(l)}>{LOCALE_LABEL[l]}</a>
            ))}
          </div>
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <i className={open ? "x" : ""} /><b>{open ? labels.close : labels.menu}</b>
          </button>
        </div>
      </header>
      <div className={`menu${open ? " open" : ""}`} id="menu" aria-hidden={!open}>
        <nav>
          {items.map(([href, text], i) => (
            <a key={href} href={href} onClick={() => setOpen(false)}><small>0{i + 1}</small><span>{text}</span></a>
          ))}
          <a href={telegram} target="_blank" rel="noopener"><small>07</small><span>Telegram ↗</span></a>
          <a href={github} target="_blank" rel="noopener"><small>08</small><span>GitHub ↗</span></a>
        </nav>
        <div className="menu-foot label"><span>t.me/oosexgangdevs</span><span>© 2026 HackiOS · OOSEX GANG</span></div>
      </div>
    </>
  );
}
