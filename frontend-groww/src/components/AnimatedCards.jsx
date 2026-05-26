import { useEffect, useRef, useState } from "react";

const features = [
  {
    id: 1,
    title: "Monitor top Intraday stocks in real time",
    linkText: "Explore Intraday stocks",
    videoSrc:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/Intraday-mock-flow.webm",
    fallbackImg:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-1.webp",
    bg: "bg-[#5660f4]",
  },
  {
    id: 2,
    title: "Upto 4x leverage with MTF (Margin Trading Facility)",
    linkText: "Explore MTF stocks",
    videoSrc:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/MTF-mock-flow.webm",
    fallbackImg:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-2.webp",
    bg: "bg-[#9ebc5c]",
  },
  {
    id: 3,
    title: "Pledge: Unlock instant margin from your holdings",
    linkText: "Explore Pledge",
    videoSrc:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/Pledge-mock-flow.webm",
    fallbackImg:
      "https://resources.groww.in/web-assets/story_assets/landing-page/home_page/img-frame-3.webp",
    bg: "bg-[#10bd7c]",
  },
];

function FeatureCard({ feature }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );

    if (ref.current) io.observe(ref.current);

    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        flex flex-col gap-[18px]
        transition-all duration-700
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-9"
        }
      `}
    >
      {/* Card */}
      <div
        className={`
          ${feature.bg}
          rounded-[20px]
          h-[260px]
          overflow-hidden
          relative
          flex
          justify-center
          items-start
        `}
      >
        {/* Phone */}
        <div
          className="
          relative
          w-[200px]
          h-[390px]
          rounded-[36px]
          border-[8px]
          border-[#0d0d0d]
          bg-[#0d0d0d]
          overflow-hidden
          mt-6
          shrink-0
          shadow-[0_24px_64px_rgba(0,0,0,.35)]
        "
        >
          {/* Notch */}
          <div
            className="
            absolute
            top-[10px]
            left-1/2
            -translate-x-1/2
            z-10
            w-[72px]
            h-[12px]
            rounded-full
            bg-[#0d0d0d]
          "
          />

          <video
            autoPlay
            muted
            loop
            playsInline
            poster={feature.fallbackImg}
            className="
              w-full
              h-full
              object-cover
              object-top
              block
            "
          >
            <source src={feature.videoSrc} type="video/webm" />
          </video>
        </div>
      </div>

      {/* Text */}
      <div>
        <h3
          className="
            text-[22px]
            font-medium
            text-white
            leading-[1.3]
            tracking-[-0.025em]
            mb-[5px]
          "
        >
          {feature.title}
        </h3>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="
            text-[#00d09c]
            text-[15px]
            font-medium
          "
        >
          {feature.linkText}
        </a>
      </div>
    </div>
  );
}

export default function TradingFeatures() {
  return (
    <section className="bg-[#0d0d0d] text-white py-[80px] pb-[140px]">

      <div
        className="
        max-w-[1400px]
        mx-auto
        px-12
        flex
        gap-30
        items-start
      "
      >
        {/* LEFT */}
        <div
          className="
            w-[520px]
            sticky
            top-[120px]
            shrink-0
          "
        >
          <h2
            className="
              text-[clamp(30px,3.8vw,50px)]
              font-medium
              leading-[1.1]
              tracking-[-0.03em]
              mb-[14px]
              whitespace-nowrap
            "
          >
            Stock trading made simple
          </h2>

          <p
            className="
              text-base
              text-[#888888]
              leading-[1.6]
              whitespace-nowrap
            "
          >
            Fast, simple and secure stock trading. All in one app.
          </p>
        </div>

        {/* RIGHT */}
        <div
          className="
            w-[620px]
            flex
            flex-col
            gap-16
            min-w-0
          "
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}