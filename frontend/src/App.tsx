import { useEffect, useRef } from 'react';

const logoUrl = 'https://i.postimg.cc/KcQZk3yC/srmsweets.jpg';
const TOTAL_FRAMES = 240;
const frameSrc = (index: number) => `/images/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const currentFrame = useRef(1);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 1) {
      const image = new Image();
      image.src = frameSrc(i);
      frames.push(image);
    }

    const updateFrame = () => {
      const hero = heroRef.current;
      const frameImage = frameRef.current;
      if (!hero || !frameImage) return;

      const heroTop = hero.offsetTop;
      const heroHeight = hero.clientHeight;
      const scrollDistance = window.scrollY - heroTop;
      const maxDistance = Math.max(heroHeight - window.innerHeight, 1);
      const progress = clamp(scrollDistance / maxDistance, 0, 1);
      const nextFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      if (nextFrame !== currentFrame.current) {
        currentFrame.current = nextFrame;
        frameImage.src = frameSrc(nextFrame);
      }
    };

    const onScroll = () => {
      if (requestRef.current !== null) return;
      requestRef.current = window.requestAnimationFrame(() => {
        updateFrame();
        requestRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateFrame();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (requestRef.current !== null) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a className="brand" href="#top">
            <img className="brand-logo" src={logoUrl} alt="SRM Sweets & Cakes logo" />
            <div>
              <span className="brand-title">SRM Sweets & Cakes</span>
              <span className="brand-subtitle">Palayapalayam</span>
            </div>
          </a>

          <nav className="nav">
            <a href="#overview">Overview</a>
            <a href="#location">Location</a>
            <a href="#hours">Hours</a>
            <a href="#footer">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <div className="hero-background" />
          <div className="hero-frame-bg">
            <img
              ref={frameRef}
              src={frameSrc(1)}
              alt="SRM animation frame"
              className="hero-frame-bg-image"
            />
          </div>
          <div className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">Cake shop</span>
              <h1>SRM Sweets & Cakes - Palayapalayam</h1>
              <p>
                A warm, modern cake and sweet destination in Erode. Premium handcrafted treats, delicious service, and a welcoming local experience.
              </p>
              <div className="hero-meta">
                <div>
                  <strong>3.9</strong>
                  <span>(713 reviews)</span>
                </div>
                <div>
                  <strong>₹1–200</strong>
                  <span>Affordable | Cake shop</span>
                </div>
              </div>
              <div className="hero-actions">
                <a className="button primary" href="#location">
                  View location
                </a>
                <a className="button secondary" href="#hours">
                  Opening hours
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-overview" id="overview">
          <div className="content-grid">
            <div className="content-card">
              <h2>Warm Hospitality</h2>
              <p>
                Every order is made with care, from classic sweets to celebration cakes. A neat, elegant presentation that matches the SRM brand tone.
              </p>
            </div>
            <div className="content-card">
              <h2>Made for Sharing</h2>
              <p>
                Enjoy city favourites like fresh cakes, ladoos, and gift-ready sweets that feel premium yet welcoming.
              </p>
            </div>
          </div>
        </section>

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

        <section className="section section-hours" id="hours">
          <div className="hours-card">
            <span className="section-label">Opening hours</span>
            <ul>
              <li>Friday: 9 am – 10 pm</li>
              <li>Saturday: 9 am – 10 pm</li>
              <li>Sunday: 9 am – 10 pm</li>
              <li>Monday: 9 am – 10 pm</li>
              <li>Tuesday: 9 am – 10 pm</li>
              <li>Wednesday: 9 am – 10 pm</li>
              <li>Thursday: 9 am – 10 pm</li>
            </ul>
          </div>
        </section>
      </main>

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
