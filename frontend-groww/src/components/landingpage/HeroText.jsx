import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// User-provided image references distributed systematically into distinct grid sectors
const testimonialCards = [
  {
    id: 1,
    name: "Vasumati",
    role: "Homemaker",
    text: "I am a very happy investor. I get an immediate response from the experts on Groww whenever I raise a query.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/05/18123825/Vasumati--150x150.png",
    style: { top: "8%", left: "4%" },
    exit: { x: -850, y: -600 },
  },
  {
    id: 2,
    name: "Puneet Gupta",
    role: "Senior Product Manager",
    text: "When it comes to financial investments, being able to trust the platform is a big deal. Groww is transparent.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/02/18123859/puneet-gupta-groww-150x150.png",
    style: { top: "6%", right: "6%" },
    exit: { x: 850, y: -600 },
  },
  {
    id: 3,
    name: "Gopalkrishnan",
    role: "Investor",
    text: "Every first-time investor should know about Groww. Groww has made investing very easy and personalized.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123443/Gopalkrishnan-e1518785171373-150x150.jpeg",
    style: { bottom: "8%", left: "6%" },
    exit: { x: -850, y: 600 },
  },
  {
    id: 4,
    name: "Ankit Puri",
    role: "Technical Product Specialist",
    text: "Groww helps me make better-informed decisions.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/05/18123824/Ankit-Puri-300x297.png",
    style: { bottom: "10%", right: "4%" },
    exit: { x: 850, y: 600 },
  },
  {
    id: 5,
    name: "Shivam Kushwaha",
    role: "Software Engineer",
    text: "You guys are really being helpful for the new investors. God bless you and your team.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123442/shivam-kushwaha-150x150.jpeg",
    style: { top: "38%", right: "2%" },
    exit: { x: 950, y: 0 },
  },
  {
    id: 6,
    name: "Sangeeta",
    role: "Business Owner",
    text: "I love that there are so many options for Mutual Funds. The data and analysis really helped me.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123442/Sangeeta-150x150.jpeg",
    style: { top: "40%", left: "4%" },
    exit: { x: -950, y: 0 },
  },
  {
    id: 7,
    name: "Anoop Singh",
    role: "Investor",
    text: "Very sleek UI and simple process flow. No paperwork overhead.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/05/18123826/Anoop-Singh-150x150.png",
    style: { bottom: "6%", left: "38%" },
    exit: { x: 0, y: 850 },
  },
  {
    id: 8,
    name: "Rahul Gupta",
    role: "Aggregator",
    text: "Best application available in the Indian market for mutual funds tracking and equity operations.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123442/Rahul-Gupta-150x150.jpeg",
    style: { top: "6%", left: "40%" },
    exit: { x: 0, y: -850 },
  },
  {
    id: 9,
    name: "Abhinav",
    role: "Product Designer",
    text: "The clean dashboard makes it incredibly fast to rebalance portfolio structures seamlessly.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/01/18123901/abhinav-e1486979446250.png",
    style: { top: "22%", left: "20%" },
    exit: { x: -650, y: -450 },
  },
  {
    id: 10,
    name: "Anoop Singh",
    role: "Strategic Analyst",
    text: "Investing without transactional frictions changed how I save capital every month.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2017/05/18123826/Anoop-Singh-150x150.png",
    style: { top: "20%", right: "24%" },
    exit: { x: 650, y: -450 },
  },
  {
    id: 11,
    name: "Neha Sharma",
    role: "Consultant",
    text: "One-click transparency updates are exactly why I migrated all stocks holdings to this ecosystem.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123442/Sangeeta-150x150.jpeg",
    style: { bottom: "24%", left: "24%" },
    exit: { x: -650, y: 450 },
  },
  {
    id: 12,
    name: "Vikram Malhotra",
    role: "Growth Head",
    text: "The speed of execution for direct funds tracking outperforms any alternate platform I have utilized.",
    image: "https://wp-asset.groww.in/wp-content/uploads/2018/02/18123442/Rahul-Gupta-150x150.jpeg",
    style: { bottom: "22%", right: "20%" },
    exit: { x: 650, y: 450 },
  },
];

// Glowing Orb Canvas Component
function GlowingOrb() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = 85;
    const CYCLE = 3000;

    function drawFrame(ts) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) % CYCLE;
      const t = elapsed / CYCLE;
      const fillLevel = (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;

      ctx.clearRect(0, 0, W, H);

      // Outer blue ambient glow
      const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.8);
      outerGlow.addColorStop(0, "rgba(30, 80, 255, 0.35)");
      outerGlow.addColorStop(0.5, "rgba(20, 60, 200, 0.18)");
      outerGlow.addColorStop(1, "rgba(0, 0, 80, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Clip to inner circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 4, 0, Math.PI * 2);
      ctx.clip();

      // Background inside circle
      ctx.fillStyle = "#0a1a6e";
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      const waveY = cy + R * (0.5 - fillLevel * 1.0);

      const pts = [
        [-R, 0],
        [-R * 0.55, -R * 0.18],
        [-R * 0.28, -R * 0.18],
        [-R * 0.05, 0],
        [R * 0.22, R * 0.12],
        [R * 0.45, 0],
        [R * 0.65, -R * 0.1],
        [R, -R * 0.05],
      ];

      function buildWavePath() {
        ctx.moveTo(cx + pts[0][0], waveY + pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const curr = pts[i];
          const mx = (prev[0] + curr[0]) / 2;
          ctx.quadraticCurveTo(
            cx + prev[0],
            waveY + prev[1],
            cx + mx,
            waveY + (prev[1] + curr[1]) / 2
          );
        }
        ctx.lineTo(cx + pts[pts.length - 1][0], waveY + pts[pts.length - 1][1]);
      }

      // Hot orange fill above wave
      ctx.save();
      ctx.beginPath();
      buildWavePath();
      ctx.lineTo(cx + R, cy - R - 10);
      ctx.lineTo(cx - R, cy - R - 10);
      ctx.closePath();
      const hotGrad = ctx.createLinearGradient(cx, cy - R, cx, waveY);
      hotGrad.addColorStop(0, "#ff4400");
      hotGrad.addColorStop(0.5, "#ff7700");
      hotGrad.addColorStop(1, "#ffaa00");
      ctx.fillStyle = hotGrad;
      ctx.fill();
      ctx.restore();

      // Blue fill below wave
      ctx.save();
      ctx.beginPath();
      buildWavePath();
      ctx.lineTo(cx + R, cy + R + 10);
      ctx.lineTo(cx - R, cy + R + 10);
      ctx.closePath();
      const blueGrad = ctx.createLinearGradient(cx, waveY, cx, cy + R);
      blueGrad.addColorStop(0, "#1a3aaa");
      blueGrad.addColorStop(1, "#0a1060");
      ctx.fillStyle = blueGrad;
      ctx.fill();
      ctx.restore();

      // Inner glass overlay
      const innerGlow = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, 0, cx, cy, R);
      innerGlow.addColorStop(0, "rgba(80, 140, 255, 0.18)");
      innerGlow.addColorStop(0.5, "rgba(40, 100, 220, 0.08)");
      innerGlow.addColorStop(1, "rgba(10, 40, 160, 0.25)");
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, R - 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end clip

      // Blue glowing ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(80, 160, 255, 0.9)";
      ctx.shadowColor = "#3388ff";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Outer ring soft glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(40, 100, 255, 0.18)";
      ctx.stroke();
      ctx.restore();

      // Orange/gold arc on ring
      const arcSpan = Math.PI * 0.18 + fillLevel * Math.PI * 1.75;
      const arcCenter = Math.PI * 1.5;
      const arcStart = arcCenter - arcSpan / 2;
      const arcEnd = arcCenter + arcSpan / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, arcStart, arcEnd);
      ctx.lineWidth = 5;
      const orangeArc = ctx.createLinearGradient(
        cx + R * Math.cos(arcStart),
        cy + R * Math.sin(arcStart),
        cx + R * Math.cos(arcEnd),
        cy + R * Math.sin(arcEnd)
      );
      orangeArc.addColorStop(0, "rgba(255, 180, 0, 0.3)");
      orangeArc.addColorStop(0.4, "rgba(255, 160, 0, 1)");
      orangeArc.addColorStop(0.6, "rgba(255, 120, 0, 1)");
      orangeArc.addColorStop(1, "rgba(255, 180, 0, 0.3)");
      ctx.strokeStyle = orangeArc;
      ctx.shadowColor = "#ff8800";
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} width={360} height={360} className="rounded-full shadow-[0_0_30px_10px_rgba(80,160,255,0.5),0_0_60px_20px_rgba(40,100,255,0.3),0_0_100px_40px_rgba(20,60,200,0.15)"/>;
}

export default function HeroText() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- INTERPOLATIONS ---
  // Color shifting exactly to Groww's branding colors
  const backgroundColor = useTransform(scrollYProgress, [0, 0.28], ["#ffffff", "#090d14"]);

  // Phase 1: Outward Parallax Scaling
  const initialLayerScale = useTransform(scrollYProgress, [0, 0.35], [1, 2.8]);
  const initialLayerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Phase 2: Groww Hexagonal Line Logo Reveal Sequence
  const logoScale = useTransform(scrollYProgress, [0.28, 0.5, 0.65], [0.2, 1.15, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.28, 0.45], [0, 1]);
  const logoRotate = useTransform(scrollYProgress, [0.28, 0.6], [-45, 0]);
  const logoY = useTransform(scrollYProgress, [0.28, 0.5], [120, 0]);

  // Phase 3: Text elements fading in up
  const textLine1Y = useTransform(scrollYProgress, [0.58, 0.72], [60, 0]);
  const textLine1Opacity = useTransform(scrollYProgress, [0.58, 0.72], [0, 1]);

  const textLine2Y = useTransform(scrollYProgress, [0.66, 0.8], [60, 0]);
  const textLine2Opacity = useTransform(scrollYProgress, [0.66, 0.8], [0, 1]);

  const actionButtonY = useTransform(scrollYProgress, [0.74, 0.88], [60, 0]);
  const actionButtonOpacity = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh] w-full bg-[#090d14]">
      {/* Viewport Frame Lock */}
      <motion.div
        style={{ backgroundColor }}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none"
      >

        {/* --- PHASE 1: INITIAL SCATTERED WORLD --- */}
        <motion.div
          style={{ scale: initialLayerScale, opacity: initialLayerOpacity }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          {/* Main Display Headline */}
          <h1 className="text-[48px] md:text-[48px] font-black text-[#090d14] tracking-tight text-center leading-tight px-6 font-sans z-30 whitespace-nowrap w-max"> Trusted by 130,834,586+ Indians </h1>

          {/* Testimonial Nodes Mapping */}
          {testimonialCards.map((card) => {
            const currentCardX = useTransform(scrollYProgress, [0, 0.35], [0, card.exit.x]);
            const currentCardY = useTransform(scrollYProgress, [0, 0.35], [0, card.exit.y]);

            return (
              <motion.div
                key={card.id}
                className="absolute bg-white p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100/80 w-[280px] flex flex-col justify-between gap-3 backdrop-blur-sm bg-white/10"
                style={{
                  ...card.style,
                  x: currentCardX,
                  y: currentCardY,
                }}
              >
                <p className="text-[11px] font-medium text-gray-600 leading-relaxed">
                  "{card.text}"
                </p>
                <div className="flex items-center gap-2.5 pt-1 border-t border-gray-50">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-7 h-7 rounded-full object-cover bg-gray-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 tracking-tight">{card.name}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{card.role}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- PHASE 2: GLOWING ORB (replaces Groww brand logo) --- */}
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity, rotate: logoRotate, y: logoY }}
          className="absolute z-20 top-[24%] flex flex-col items-center justify-center"
        >
          <GlowingOrb />
        </motion.div>

        {/* --- PHASE 3: TEXT CONTEXT & CALL TO ACTION --- */}
        <div className="absolute z-20 w-full max-w-4xl px-6 text-center top-[76%] flex flex-col items-center justify-center font-sans">
          <motion.h2
            style={{ y: textLine1Y, opacity: textLine1Opacity }}
            className="text-2xl md:text-[44px] font-medium text-[#9aa4b2] tracking-tight leading-tight mb-3"
          >
            No account opening charges, no barriers.
          </motion.h2>

          <motion.h2
            style={{ y: textLine2Y, opacity: textLine2Opacity }}
            className="text-3xl md:text-[56px] font-black text-white tracking-tight leading-none mb-10"
          >
            Just Groww.
          </motion.h2>

          <motion.button
            style={{ y: actionButtonY, opacity: actionButtonOpacity }}
            className="bg-[#00d09c] text-[#090d14] text-base font-bold py-3.5 px-10 rounded-full shadow-[0_8px_25px_rgba(0,208,156,0.3)] transition-transform duration-200 active:scale-95 cursor-pointer hover:bg-[#00be8e]"
          >
            Start now
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
}