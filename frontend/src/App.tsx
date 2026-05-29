import { useEffect, useRef } from 'react';

const logoUrl = 'https://i.postimg.cc/KcQZk3yC/srmsweets.jpg';
const TOTAL_FRAMES = 240;
const frameSrc = (index: number) =>
  `/images/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export default function App() {
  // heroScrollRef → the tall wrapper that drives scroll progress
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const frameRef      = useRef<HTMLImageElement>(null);
  const displayFrame  = useRef(1);   // float, lerp target
  const targetFrame   = useRef(1);   // integer set on scroll
  const shownFrame    = useRef(1);   // last src we wrote
  const rafId         = useRef<number | null>(null);

  useEffect(() => {
    // ── preload all 240 frames ──────────────────────────────────
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      frames.push(img);
    }

    // ── map scroll → target frame ───────────────────────────────
    const onScroll = () => {
      const section = heroScrollRef.current;
      if (!section) return;
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled   = window.scrollY - section.offsetTop;
      const progress   = clamp(scrolled / scrollable, 0, 1);
      targetFrame.current = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;
    };

    // ── rAF loop: lerp displayFrame → targetFrame ───────────────
    const tick = () => {
      const img = frameRef.current;
      if (img) {
        const cur = displayFrame.current;
        const tgt = targetFrame.current;
        // 0.055 = slow, buttery lerp (lower = slower)
        displayFrame.current = cur + (tgt - cur) * 0.055;

        const rounded = clamp(Math.round(displayFrame.current), 1, TOTAL_FRAMES);
        if (rounded !== shownFrame.current) {
          shownFrame.current = rounded;
          const f = frames[rounded - 1];
          if (f && f.complete && f.naturalWidth > 0) {
            img.src = f.src;
          }
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* ── Header: centered logo + nav row below (like Aswins) ── */}
      <header className="header">
        <div className="header-brand-row">
          <a className="brand" href="#hero">
            <img className="brand-logo" src={logoUrl} alt="SRM Sweets & Cakes" />
            <div>
              <span className="brand-title">SRM Sweets & Cakes</span>
              <span className="brand-subtitle">Palayapalayam</span>
            </div>
          </a>
        </div>
        <div className="header-nav-row">
          <nav className="nav">
            <a href="#overview">Overview</a>
            <a href="#location">Location</a>
            <a href="#hours">Hours</a>
            <a href="#footer">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero: tall scroll wrapper → sticky full-viewport frame ── */}
        <div ref={heroScrollRef} className="hero-scroll" id="hero">
          <div className="hero-sticky">

            {/* Full-size animation frame — behind everything */}
            <img
              ref={frameRef}
              src={frameSrc(1)}
              alt="SRM animation"
              className="hero-frame-img"
            />

            {/* Gradient scrim so text is readable */}
            <div className="hero-scrim" />

            {/* Text content on top */}
            <div className="hero-content">
              <span className="eyebrow">Cake shop · Erode</span>
              <h1>SRM Sweets<br />& Cakes</h1>
              <p>
                Premium handcrafted treats, celebration cakes, and traditional
                sweets — crafted with love in Palayapalayam.
              </p>
              <div className="hero-meta">
                <div>
                  <strong>3.9 ★</strong>
                  <span>713 reviews</span>
                </div>
                <div>
                  <strong>₹1 – 200</strong>
                  <span>Affordable</span>
                </div>
              </div>
              <div className="hero-actions">
                <a className="button primary" href="#location">View location</a>
                <a className="button secondary" href="#hours">Opening hours</a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Overview ─────────────────────────────────────────── */}
        <section className="section section-overview" id="overview">
          <div className="content-grid">
            <div className="content-card">
              <h2>Warm Hospitality</h2>
              <p>
                Every order is made with care, from classic sweets to celebration
                cakes. A neat, elegant presentation that matches the SRM brand tone.
              </p>
            </div>
            <div className="content-card">
              <h2>Made for Sharing</h2>
              <p>
                Enjoy city favourites like fresh cakes, ladoos, and gift-ready
                sweets that feel premium yet welcoming.
              </p>
            </div>
          </div>
        </section>

        {/* ── Location ─────────────────────────────────────────── */}
        <section className="section section-location" id="location">
          <div className="section-left">
            <div className="info-block">
              <span className="section-label">Address</span>
              <h2>146, Perundurai Rd, EB Officer's Colony</h2>
              <p>Palayapalayam, Erode, Tamil Nadu 638011</p>
            </div>
            <div className="info-block">
              <span className="section-label">Secondary Outlet</span>
              <h3>35, Thiru Vi Ka St, Municipal Colony</h3>
              <p>Edayankattuvalasu, Erode, Tamil Nadu 638004</p>
            </div>
          </div>
          <div className="map-card">
            <div className="map-header">
              <h2>Find us on the map</h2>
            </div>
            <iframe
              title="SRM Sweets location"
              src="https://maps.google.com/maps?q=146%2C%20Perundurai%20Rd%2C%20Erode%2C%20Tamil%20Nadu%20638011&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ── Hours ────────────────────────────────────────────── */}
        <section className="section section-hours" id="hours">
          <div className="hours-card">
            <span className="section-label">Opening hours</span>
            <ul>
              <li>Monday: 9 am – 10 pm</li>
              <li>Tuesday: 9 am – 10 pm</li>
              <li>Wednesday: 9 am – 10 pm</li>
              <li>Thursday: 9 am – 10 pm</li>
              <li>Friday: 9 am – 10 pm</li>
              <li>Saturday: 9 am – 10 pm</li>
              <li>Sunday: 9 am – 10 pm</li>
            </ul>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div>
            <p className="footer-title">SRM Sweets & Cakes</p>
            <p>Pure, clean dessert experiences in Palayapalayam.</p>
          </div>
          <div>
            <p>Questions? Call us at <strong>+91 99999 00000</strong></p>
            <p>hello@srmsweets.in</p>
          </div>
        </div>
      </footer>
    </>
  );
}
