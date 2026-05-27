import { useRef, useEffect } from "react";

const images = [
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-14.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-8.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-13.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-7.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-12.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-6.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-9.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-10.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-1.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-2.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-3.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-4.webp",
  "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/channel-card-5.webp",
];

const allCards = [...images, ...images, ...images];

const CARD_WIDTH = 220;
const CARD_GAP = 20;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const SCROLL_SPEED = 0.6;

// How many cards are visible approx in viewport (used for curve calc)
const VISIBLE_CARDS = 6;
const CURVE_DEPTH = 38; // px drop at edges (arc depth)

export default function FinanceLanguageCarousel() {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const containerRef = useRef(null);

  const singleSetWidth = images.length * CARD_STEP;

  useEffect(() => {
    function animate() {
      if (!pausedRef.current) {
        offsetRef.current += SCROLL_SPEED;
        if (offsetRef.current >= singleSetWidth) {
          offsetRef.current -= singleSetWidth;
        }
      }

      const track = trackRef.current;
      const container = containerRef.current;
      if (track && container) {
        const containerWidth = container.offsetWidth;
        const centerX = containerWidth / 2;
        const cards = track.children;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const cardLeft = i * CARD_STEP - offsetRef.current + 40;
          const cardCenterX = cardLeft + CARD_WIDTH / 2;

          // Normalize position: -1 (far left) to 0 (center) to 1 (far right)
          const norm = (cardCenterX - centerX) / (containerWidth * 0.55);
          const clamped = Math.max(-1, Math.min(1, norm));

          // Parabolic arc: y = depth * norm^2  (center = 0, edges = CURVE_DEPTH)
          const translateY = CURVE_DEPTH * clamped * clamped;

          // Slight rotateY tilt toward center
          const rotateY = -clamped * 14;

          // Slight scale: center cards slightly bigger
          const scale = 1 - Math.abs(clamped) * 0.06;

          card.style.transform = `translateY(${translateY}px) perspective(900px) rotateY(${rotateY}deg) scale(${scale})`;
        }

        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [singleSetWidth]);

  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        padding: "60px 0",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: "42px",
          fontWeight: "700",
          color: "#1a1a2e",
          marginBottom: "24px",
          textAlign: "center",
          letterSpacing: "-0.5px",
        }}
      >
        Finance simplified, in your language
      </h2>

      {/* Watch Button */}
      <a
        href="https://www.youtube.com/@GrowwIndia"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          border: "1.5px solid #d1d5db",
          borderRadius: "999px",
          padding: "8px 20px",
          fontSize: "15px",
          fontWeight: "600",
          color: "#1a1a2e",
          textDecoration: "none",
          marginBottom: "52px",
          background: "#fff",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.10)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="16" rx="4" fill="#FF0000" />
          <path d="M9 11.5V4.5L15.5 8L9 11.5Z" fill="white" />
        </svg>
        Watch
      </a>

      {/* Carousel Viewport */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          paddingBottom: `${CURVE_DEPTH + 10}px`,
        }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* Fade masks */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
          background: "linear-gradient(to right, #ffffff, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
          background: "linear-gradient(to left, #ffffff, transparent)",
          pointerEvents: "none",
        }} />

        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: `${CARD_GAP}px`,
            willChange: "transform",
            paddingLeft: "40px",
            paddingTop: "10px",
            alignItems: "flex-start",
          }}
        >
          {allCards.map((src, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: `${CARD_WIDTH}px`,
                height: "300px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                cursor: "pointer",
                willChange: "transform",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
              }}
            >
              <img
                src={src}
                alt={`channel-card-${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}