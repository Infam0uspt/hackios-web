import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import Mascot from "@/components/Mascot";
import Effects from "@/components/Effects";
import Monogram from "@/components/Monogram";
import CopyButton from "@/components/CopyButton";
import Film from "@/components/Film";
import { isLocale, type Locale } from "@/lib/locales";
import { getDict } from "@/lib/dict";
import { getTelegramSubscribers } from "@/lib/telegram";
import { GITHUB_URL, SITE_URL, TELEGRAM, TEAM, TOKEN, PRESS, CONTACT_HANDLE } from "@/lib/site";

export const revalidate = 1800;

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale as Locale);
  const subs = await getTelegramSubscribers();
  const nf = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale);
  const compact = `${Math.floor(subs / 1000)}K+`;
  const pageUrl = `${SITE_URL}/${locale}`;
  const share = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(d.share_text)}&url=${encodeURIComponent(pageUrl)}`,
    tg: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(d.share_text)}`,
  };
  const mq = d.mq.map((s) => s.replace("{c}", compact));

  return (
    <>
      <Preloader label={d.loading} />
      <Header locale={locale as Locale} github={GITHUB_URL} telegram={TELEGRAM.url} labels={{ menu: d.menu, close: d.close, nav: d.nav }} />
      <Effects />

      <main id="top">
        <section className="hero" id="hero">
          <div className="hero-top wrap">
            <div className="inner">
              <span className="chip-exp">{d.chip}</span>
              <h1>
                <span className="ln l1"><span>HACK<em>iOS</em></span></span>
                <span className="ln l2"><span>{d.hero_l2}</span></span>
              </h1>
            </div>
          </div>
          <Mascot label="Oosy, the HackiOS mascot" />
          <div className="hint">{d.hint}</div>
          <div className="hero-meta wrap">
            <div className="inner">
              <div>
                <p className="hero-sub">{d.hero_sub}</p>
                <div className="hero-ctas">
                  <a className="btn" href={TELEGRAM.url} target="_blank" rel="noopener"><span>{d.cta_tg}</span><Arrow /></a>
                  <a className="btn ghost" href="#team"><span>{d.cta_team}</span></a>
                </div>
              </div>
              <div className="label coords">
                <span className="live"><i />{d.live.replace("{n}", nf.format(subs))}</span><br />
                <span>{d.meta1}</span><br />
                <span>t.me/{TELEGRAM.channel}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1, 2, 3].flatMap((k) => mq.map((s, i) => <span key={`${k}-${i}`}>{s}</span>))}
          </div>
        </div>

        <section className="band wrap" id="about">
          <div className="inner">
            <div className="sec-head rv">
              <span className="label dot">{d.about_k}</span>
              <h2 data-scramble>{d.about_t}</h2>
              <p>{d.about_p}</p>
            </div>
            <div className="pillars rv">
              {d.pillars.map((p, i) => (
                <article className="pillar" key={i}><span className="n">0{i + 1}</span><h3>{p[0]}</h3><p>{p[1]}</p></article>
              ))}
            </div>
            <div className="facts rv">
              <div className="fact"><b>{Math.floor(subs / 1000)}K<em>+</em></b><span>{d.f1}</span></div>
              <div className="fact"><b>{TEAM.length}</b><span>{d.f2}</span></div>
              <div className="fact"><b><em>$</em>0</b><span>{d.f3}</span></div>
              <div className="fact"><b>2026</b><span>{d.f4}</span></div>
            </div>
          </div>
        </section>

        <section className="band wrap film-sec" id="film">
          <div className="inner">
            <div className="sec-head rv">
              <span className="label dot">{d.film_k}</span>
              <h2 data-scramble>{d.film_t}</h2>
              <p>{d.film_p}</p>
            </div>
            <div className="film rv">
              <Film />
            </div>
          </div>
        </section>

        <section className="band wrap team-sec" id="team">
          <div className="inner">
            <div className="sec-head rv">
              <span className="label dot">{d.team_k}</span>
              <h2 data-scramble>{d.team_t}</h2>
              <p>{d.team_p}</p>
            </div>
            <div className="team rv">
              {TEAM.map((m, i) => (
                <a className="member" key={m.handle} href={`https://t.me/${m.handle}`} target="_blank" rel="noopener">
                  <div className="mono-tile"><Monogram letter={m.handle[0].toUpperCase()} seed={i * 1.9} /></div>
                  <span className="tag">{m.country}</span>
                  <div className="who">
                    <div>
                      <div className="handle">@{m.handle}</div>
                      <div className="role">{m.role === "founder" ? <b>{d.founder}</b> : m.role === "ceo" ? <><b>CEO</b> · {d.ceo}</> : d.teammate}</div>
                    </div>
                    <span className="go"><Arrow /></span>
                  </div>
                </a>
              ))}
            </div>
            <div className="team-note rv">
              <span className="label">{d.coop_l}</span>
              <a href={`https://t.me/${CONTACT_HANDLE}`} target="_blank" rel="noopener">@{CONTACT_HANDLE}</a>
            </div>
          </div>
        </section>

        <section className="band wrap" id="press">
          <div className="inner">
            <div className="sec-head rv">
              <span className="label dot">{d.press_k}</span>
              <h2 data-scramble>{d.press_t}</h2>
              <p>{d.press_p}</p>
            </div>
            <div className="press rv">
              {PRESS.map((p) => (
                <a className="asset" key={p.file} href={`/press/${p.file}`} download>
                  <div className="thumb"><img src={`/press/${p.file}`} alt={d.press_items[p.key]} loading="lazy" /></div>
                  <div className="asset-meta"><span>{d.press_items[p.key]}</span><small>{p.size} · PNG</small></div>
                  <span className="dl">{d.press_dl} ↓</span>
                </a>
              ))}
            </div>
            <div className="brand rv">
              <span className="label">{d.brand_t}</span>
              <ul>{d.brand.map((b, i) => <li key={i}>{b}</li>)}</ul>
              <div className="swatches" aria-hidden="true"><i style={{ background: "#0a0909" }} /><i style={{ background: "#e8170f" }} /><i style={{ background: "#efe9e6" }} /></div>
            </div>
          </div>
        </section>

        <section className="band wrap share-sec">
          <div className="inner share rv">
            <div>
              <span className="label dot">{d.share_k}</span>
              <h2 data-scramble>{d.share_t}</h2>
              <p>{d.share_p}</p>
            </div>
            <div className="share-btns">
              <a className="btn" href={share.x} target="_blank" rel="noopener"><span>{d.share_x}</span><Arrow /></a>
              <a className="btn ghost" href={share.tg} target="_blank" rel="noopener"><span>{d.share_tg}</span><Arrow /></a>
              <CopyButton value="location" label={d.share_copy} done={d.copied} className="btn ghost" />
            </div>
          </div>
        </section>

        <section className="band wrap" id="token">
          <div className="inner token">
            <div className="token-copy rv">
              <div className="coin" aria-hidden="true"><span>H</span></div>
              <span className="label dot">{d.token_k}</span>
              <h2>{d.token_t}</h2>
              <p>{d.token_p}</p>
            </div>
            <div className="rv">
              <div className="spec">
                <dl>
                  <dt>{d.sp.net}</dt><dd>{TOKEN.network}</dd>
                  <dt>{d.sp.plat}</dt><dd>{TOKEN.platform}</dd>
                  <dt>{d.sp.tick}</dt><dd>{TOKEN.ticker}</dd>
                  <dt>{d.sp.sup}</dt><dd>{TOKEN.supply}</dd>
                  <dt>{d.sp.fee}</dt><dd>{d.sp.fee_v}</dd>
                </dl>
                <div className="addr">
                  <span className="label">{d.sp.addr}</span>
                  <code>{TOKEN.contract}</code>
                  <CopyButton value={TOKEN.contract} label={d.copy} done={d.copied} />
                </div>
                <div className="spec-foot">
                  <span className="label">{d.sp.check}</span>
                  <a className="btn ghost" href={TOKEN.url} target="_blank" rel="noopener"><span>{d.sp.open}</span><Arrow /></a>
                </div>
              </div>
              <p className="risk">{d.risk}</p>
            </div>
          </div>
        </section>

        <section className="band wrap faq-sec" id="faq">
          <div className="inner faq">
            <div><span className="label dot">{d.faq_k}</span><h2>FAQ</h2></div>
            <div>
              {d.faq.map((q, i) => (
                <details key={i} open={i === 0}><summary><span>{q[0]}</span><i /></summary><p>{q[1]}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <div className="inner">
          <div className="cta rv">
            <h2 data-scramble>{d.cta_t}</h2>
            <div className="cta-r">
              <span className="label">{d.cta_l} · {nf.format(subs)}</span>
              <a className="btn" href={TELEGRAM.url} target="_blank" rel="noopener"><span>{d.cta_btn}</span><Arrow /></a>
            </div>
          </div>
          <div className="foot-grid">
            <div><span className="label">{d.ft_ch}</span><a href={TELEGRAM.url} target="_blank" rel="noopener">t.me/{TELEGRAM.channel}</a></div>
            <div><span className="label">{d.ft_code}</span><a href={GITHUB_URL} target="_blank" rel="noopener">GitHub ↗</a></div>
            <div><span className="label">{d.ft_team}</span><div className="foot-list">{TEAM.map((m) => <a key={m.handle} href={`https://t.me/${m.handle}`} target="_blank" rel="noopener">@{m.handle}</a>)}</div></div>
            <div><span className="label">{d.ft_tok}</span><a href={TOKEN.url} target="_blank" rel="noopener">{TOKEN.ticker} · flap.sh</a></div>
          </div>
          <div className="wordmark" aria-hidden="true">HACK<em>iOS</em></div>
          <p className="disc">{d.disc}</p>
          <div className="legal label"><span>© HackiOS 2026. {d.rights}</span><span>{d.design}</span><a href="#top">{d.top}</a></div>
        </div>
      </footer>
    </>
  );
}
