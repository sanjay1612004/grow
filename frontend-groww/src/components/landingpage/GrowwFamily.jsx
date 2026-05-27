import { useRef, useState } from "react";

const cards = [
  {
    title: "915",
    image: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/card-915.webp",
    link: "https://915.groww.in",
  },
  {
    title: "W",
    image: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/card-W.webp",
    link: "https://w.groww.in",
  },
  {
    title: "API Trading",
    image: "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/card-trade-api.webp",
    link: "https://groww.in/trade-api",
  },
];

function Card({ title, image, link }) {
  const cardRef = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: "50%", y: "50%" });
  const [glareVisible, setGlareVisible] = useState(false);
  const [lifted, setLifted] = useState(false);

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x: `${x}%`, y: `${y}%` });
  }

  return (
    <a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setGlareVisible(true); setLifted(true); }}
      onMouseLeave={() => { setGlareVisible(false); setLifted(false); }}
      className="relative overflow-hidden rounded-[25px] cursor-pointer block"
      style={{
        width: "320px",
        height: "420px",
        transition: "transform 0.4s ease",
        transform: lifted ? "translateY(-10px) scale(1.04)" : "translateY(0px) scale(1)",
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover block"
      />

      {/* Glare */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[25px] transition-opacity duration-300"
        style={{
          opacity: glareVisible ? 1 : 0,
          background: `radial-gradient(circle at ${glarePos.x} ${glarePos.y}, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        }}
      />
    </a>
  );
}

export default function GrowwFamily() {
  return (
    <div
      className="flex flex-col justify-center items-center text-white"
      style={{
        minHeight: "100vh",
        background: "#050816",
        padding: "80px 40px",
      }}
    >
      <h2
        className="font-bold text-center"
        style={{ fontSize: "48px", marginBottom: "60px" }}
      >
        More from the Groww family
      </h2>

      <div className="flex flex-wrap justify-center gap-[30px]">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}