import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  {
    heading: "Track charts, positions, and trade in a customisable layout",
    cta: "Explore Terminal",
    ctaStyle: "white",
    bg: "radial-gradient(ellipse 65% 90% at 80% 50%, #0d2e1a 0%, #060d07 100%)",
    img: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-1.webp",
  },
  {
    heading: "Analyse Chains, view payoffs, create baskets",
    cta: "Option Chain",
    ctaStyle: "white",
    bg: "radial-gradient(ellipse 65% 90% at 80% 50%, #0c1e2a 0%, #05090e 100%)",
    img: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-2.webp",
  },
  {
    heading: "One-tap trade with Scalper mode on mobile",
    cta: "Explore Scalper mode",
    ctaStyle: "white",
    bg: "radial-gradient(ellipse 65% 90% at 80% 50%, #0d2e1a 0%, #060d07 100%)",
    img: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-3.webp",
  },
  {
    heading: "Trade in real world assets like Crude Oil, Gold, Silver and more",
    cta: "Explore Commodities",
    ctaStyle: "gold",
    bg: "radial-gradient(ellipse 65% 90% at 80% 50%, #2a1e08 0%, #0e0905 100%)",
    img: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-4.webp",
  },
];

const ctaStyles = {
  white: {
    background: "#fff",
    color: "#111",
    border: "none",
    arrowBg: "#111",
    arrowColor: "#fff",
  },
  gold: {
    background: "#3a2a10",
    color: "#f5c842",
    border: "1px solid #5a4020",
    arrowBg: "#f5c842",
    arrowColor: "#111",
  },
};

export default function HeroFrames() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [exiting, setExiting] = useState(false);
  const outerRef = useRef(null);
  const rafRef = useRef(null);
  const lastSlide = useRef(0);

  const goToSlide = useCallback(
    (idx) => {
      if (idx === lastSlide.current) return;
      setPrevSlide(lastSlide.current);
      setExiting(true);
      setTimeout(() => setExiting(false), 600);
      lastSlide.current = idx;
      setActiveSlide(idx);
    },
    []
  );

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = outerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const trackTop = -rect.top;
        const trackHeight = rect.height - window.innerHeight;
        if (trackTop <= 0) { goToSlide(0); return; }
        if (trackTop >= trackHeight) { goToSlide(SLIDES.length - 1); return; }
        const progress = trackTop / trackHeight;
        const idx = Math.min(SLIDES.length - 1, Math.floor(progress * SLIDES.length));
        goToSlide(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [goToSlide]);

  const slide = SLIDES[activeSlide];
  const cs = ctaStyles[slide.ctaStyle];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

        .gfs-body {
          background: #070c07;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }

        .gfs-intro {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 2rem;
          background: #070c07;
        }

        .gfs-intro h1 {
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 700;
          color: #fff;
          max-width: 680px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .gfs-outer {
          position: relative;
          height: 400vh;
        }

        .gfs-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        .gfs-bg {
          position: absolute;
          inset: 0;
          transition: background 0.7s ease;
        }

        .gfs-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 0 6vw;
        }

        .gfs-left {
          flex: 0 0 400px;
          max-width: 400px;
          position: relative;
          z-index: 2;
        }

        .gfs-heading {
          font-size: clamp(1.5rem, 2.4vw, 2.4rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.22;
          margin-bottom: 1.6rem;
          letter-spacing: -0.02em;
        }

        .gfs-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.18s ease, opacity 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .gfs-cta:hover { transform: scale(1.04); }
        .gfs-cta:active { transform: scale(0.97); }

        .gfs-arrow {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        .gfs-right {
          flex: 1;
          position: relative;
          height: 100%;
          overflow: visible;
        }

        .gfs-img-wrap {
  position: absolute;
  right: -18vw;
  top: 65%;
  width: 125%;
  height: 95%;
  max-width: 1600px;
  transform: translateY(-50%);
}

        .gfs-img-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .gfs-dots {
          position: absolute;
          left: 6vw;
          bottom: 36px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .gfs-dot {
          height: 6px;
          border-radius: 3px;
          cursor: pointer;
          transition: width 0.35s ease, background 0.35s ease;
          background: rgba(255,255,255,0.25);
          width: 6px;
          border: none;
          padding: 0;
        }

        .gfs-dot.active {
          width: 22px;
          background: rgba(255,255,255,0.9);
        }

        .gfs-after {
          height: 50vh;
          background: #070c07;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }

        /* Animations */
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(44px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutUp {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-44px); }
        }
        @keyframes imgIn {
          from { opacity: 0; transform: translateY(-50%) translateX(60px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        @keyframes imgOut {
          from { opacity: 1; transform: translateY(-50%) translateX(0); }
          to   { opacity: 0; transform: translateY(-50%) translateX(-60px); }
        }

        .text-enter {
          animation: slideInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .text-exit {
          animation: slideOutUp 0.5s ease forwards;
          pointer-events: none;
        }
        .img-enter {
          animation: imgIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .img-exit {
          animation: imgOut 0.5s ease forwards;
          pointer-events: none;
        }
      `}</style>

      <div className="gfs-body">
        {/* Intro */}
        {/* <div className="gfs-intro">
          <h1>Trade Futures &amp; Options like a pro</h1>
        </div> */}

        {/* Sticky scroll section */}
        <div className="gfs-outer" ref={outerRef} >
<h1 className="mx-auto pt-10 max-w-[1505px] text-center text-[44px] font-semibold tracking-[-1px] text-[#F2F5F7] leading-[48px]" style={{ background: slide.bg }}>
    Trade Futures &amp; Options like a pro
            </h1>

          <div className="gfs-sticky">

            {/* Animated background */}
            <div
              className="gfs-bg"
              style={{ background: slide.bg }}
            />

            <div className="gfs-content">
              {/* Left text */}
              <div className="gfs-left">
                <div
                  key={`text-${activeSlide}`}
                  className={exiting ? "text-exit" : "text-enter"}
                >
                  <h2 className="gfs-heading">{slide.heading}</h2>
                  <a
                    href="#"
                    className="gfs-cta"
                    style={{
                      background: cs.background,
                      color: cs.color,
                      border: cs.border || "none",
                    }}
                  >
                    {slide.cta}
                    <span
                      className="gfs-arrow"
                      style={{ background: cs.arrowBg, color: cs.arrowColor }}
                    >
                      ›
                    </span>
                  </a>
                </div>
              </div>

              {/* Right image */}
              <div className="gfs-right">
                <div
                  key={`img-${activeSlide}`}
                  className={`gfs-img-wrap ${exiting ? "img-exit" : "img-enter"}`}
                >
                  <img src={slide.img} alt={slide.heading} />
                </div>
              </div>
            </div>

           

          </div>
        </div>

      </div>
    </>
  );
}