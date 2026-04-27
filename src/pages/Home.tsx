import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { Hexagon } from "../components/Hexagon";
import { useNavigate } from "react-router-dom";
import Grainient from "../components/Grainient";
import { useBooking } from "../App";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

const ScrollSection = ({ children, className = "", speed = 1 }: { children: React.ReactNode, className?: string, speed?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [60 * speed, 0, -60 * speed]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]), springConfig);

  return (
    <motion.section 
      ref={ref}
      style={{ y, opacity }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
};

const ReadabilityGlow = () => (
  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 pointer-events-none opacity-[0.15] blur-[120px] bg-radial-[circle_at_center,_var(--color-ink)_0%,_transparent_70%] h-[180%]" />
);

const FloatingHex = ({ scrollYProgress, index, offset }: { scrollYProgress: any, index: number, offset: number }) => {
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, index * 30]);
  
  const positions = [
    { left: "10%", top: "20%" },
    { left: "80%", top: "40%" },
    { left: "15%", top: "70%" },
    { left: "75%", top: "10%" },
    { left: "5%", top: "50%" },
    { left: "85%", top: "80%" },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      style={{ y, rotate, ...pos }}
      className="absolute pointer-events-none opacity-[0.03] -z-10"
    >
      <Hexagon size={120 + index * 40} outline className="text-ink" />
    </motion.div>
  );
};

// ─── UNUSED BUT PRESERVED COMPONENTS ───────────────────────────────────────
const CapabilityPanel = ({ label, title, desc, index }: { label: string; title: string; desc: string; index: number; }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 32, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 } } }} className="group relative rounded-[2rem] border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm px-8 py-8 overflow-hidden transition-all duration-700 hover:border-white/[0.15] hover:bg-white/[0.07]">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
    <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20 block mb-5">{label}</span>
    <h3 className="text-[17px] font-bold text-white leading-snug mb-3 tracking-[-0.01em]">{title}</h3>
    <p className="text-[14px] font-light text-white/40 leading-relaxed">{desc}</p>
  </motion.div>
);

const RoadmapStage = ({ step, title, desc, items, isLast }: { step: string; title: string; desc: string; items: string[]; isLast?: boolean; }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }} className="relative flex gap-8 md:gap-12">
    <div className="flex flex-col items-center flex-shrink-0 w-10">
      <div className="w-10 h-10 rounded-full border border-ink/15 bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-10"><span className="text-[10px] font-bold tracking-wider text-ink/40">{step}</span></div>
      {!isLast && <div className="flex-1 w-px bg-gradient-to-b from-ink/10 to-transparent mt-3 min-h-[80px]" />}
    </div>
    <div className={`flex-1 pb-16 ${isLast ? "" : ""}`}>
      <div className="group rounded-[2rem] border border-ink/[0.06] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-1 px-8 py-8 md:px-10 md:py-9 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent pointer-events-none opacity-60" />
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-2">{title}</h3>
          <p className="text-sm text-ink/50 font-light leading-relaxed mb-6 max-w-xl">{desc}</p>
          <ul className="flex flex-wrap gap-2">{items.map(item => <li key={item} className="text-[11px] font-medium text-ink/50 tracking-wide bg-ink/[0.04] px-3 py-1.5 rounded-full border border-ink/[0.06] group-hover:border-ink/10 transition-colors">{item}</li>)}</ul>
        </div>
      </div>
    </div>
  </motion.div>
);

const pricingContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const pricingCardVariants = { hidden: { opacity: 0, y: 60, scale: 0.96, rotateX: 5 }, visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } };

// ───────────────────────────────────────────────────────────────────────────

const platformContainerVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
};

export const Home = () => {
  const navigate = useNavigate();
  const { openBooking } = useBooking();
  const [modelIndex, setModelIndex] = useState(0);
  const models = ["ChatGPT", "Claude", "Google AI Overview"];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setModelIndex((prev) => (prev + 1) % models.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10"
    >
      <main>
        {/* ── HERO (LOCKED) ─────────────────────────────────────────────────── */}
        <section className="relative h-screen bg-black text-white text-center overflow-hidden flex items-center justify-center pt-20">
          <div className="absolute inset-0">
            <Grainient
              color1="#ffffff"
              color2="#000000"
              color3="#606060"
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.07}
              rotationAmount={1440}
              noiseScale={2}
              grainAmount={0.19}
              grainScale={2.1}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </div>
          <div className="max-w-3xl mx-auto relative z-10 pointer-events-none px-4">
            <div className="pointer-events-auto relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 pointer-events-none opacity-[0.85] blur-[100px] bg-radial-[circle_at_center,_black_0%,_transparent_80%] h-[150%] w-[150%] left-1/2 -translate-x-1/2" />
              <h1 className="text-4xl md:text-6xl font-nixie mb-8 tracking-tighter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                READY TO BE <br />
                <span className="text-white border-2 border-white px-3 inline-block mt-2">VISIBLE?</span>
              </h1>
              <p className="text-lg mb-4 font-nixie opacity-90 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                Optimizing your brand for
                <span className="relative inline-block min-w-[140px] text-left h-[1.2em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={models[modelIndex]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 whitespace-nowrap"
                    >
                      {models[modelIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>
              
              <p className="text-sm mb-12 font-light opacity-60 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                We track and analyze how AI systems talk about your brand, industry, and competitors — then build the strategy to help your company appear in AI-generated answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white border-2 border-white transition-all"
                >
                  Book a Strategic Call
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: CONTEXT ────────────────────────────────────────────── */}
        <section className="relative bg-ink text-white overflow-hidden py-32 md:py-48">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-nixie leading-[1.1] tracking-tight mb-8">
                AI is changing how customers<br />
                <span className="text-white/40">discover brands.</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
                Understand where your brand appears, how it is described, and which competitors are being recommended.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 3: HOW IT WORKS ───────────────────────────────────────── */}
        <section className="relative bg-surface-50 overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.6] mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 -z-20 opacity-[0.04]">
            <Grainient color1="#000000" color2="#ffffff" color3="#808080" timeSpeed={0.05} warpStrength={0.22} zoom={2.2} />
          </div>

          <div className="section-container pt-28 md:pt-40">
            <div className="max-w-3xl mx-auto w-full relative group">
              <ScrollStack useWindowScroll={true}>
                <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Prompts</span>
                    <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">Find the prompts that matter.</h3>
                    <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                      We identify the questions your customers are asking AI before they ever reach your website.
                    </p>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Tracking</span>
                    <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">Track your AI visibility.</h3>
                    <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                      Monitor how your brand appears across ChatGPT, Claude, and Google AI Overview.
                    </p>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Competitive Position</span>
                    <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">See who AI recommends.</h3>
                    <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                      Compare your brand against the competitors appearing inside AI-generated answers.
                    </p>
                </ScrollStackItem>
              </ScrollStack>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: STRATEGY ───────────────────────────────────────────── */}
        <ScrollSection className="py-32 md:py-48 bg-surface-50 border-t border-ink/[0.04]" speed={0.8}>
          <FloatingHex scrollYProgress={scrollYProgress} index={4} offset={200} />
          <div className="section-container relative z-10 px-4">
            <div className="text-center mb-16 relative">
              <span className="text-[10px] font-bold tracking-[0.4em] text-ink/30 uppercase mb-6 block drop-shadow-sm">Strategy</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-nixie text-ink tracking-tight drop-shadow-sm mb-6">Turn insight into strategy.</h2>
              <p className="text-xl md:text-2xl text-ink/60 font-light max-w-2xl mx-auto leading-relaxed">
                Use dashboards, audits, and expert guidance to improve your position inside AI-generated intelligence.
              </p>
            </div>
            
            <div className="mt-16 max-w-5xl mx-auto surface-plate rounded-[2.5rem] h-64 md:h-[28rem] flex flex-col items-center justify-center p-8 text-center bg-white/20">
               <Hexagon size={48} outline className="text-ink/20 mb-6 mx-auto" />
               <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink/30 font-bold">[ Premium Dashboard Visual Placeholder ]</span>
            </div>
          </div>
        </ScrollSection>

        {/* ── SECTION 5: FINAL CTA ──────────────────────────────────────────── */}
        <ScrollSection className="py-32 md:py-48 bg-surface-50 relative overflow-hidden" speed={0.5}>
          <div className="section-container relative z-10 w-full px-4 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={platformContainerVariants}
              viewport={{ once: true, margin: "-80px" }}
              className="max-w-6xl mx-auto text-center relative surface-plate-dark overflow-hidden rounded-[3rem] md:rounded-[4.5rem] px-6 py-24 md:py-36 shadow-[0_40px_160px_-20px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-nixie text-white leading-[0.9] mb-10 tracking-tighter drop-shadow-xl">
                  Secure your place<br/>
                  <span className="text-white/40">in the future of search.</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/60 font-light mb-16 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                  Understand how AI systems see your brand — and build the strategy to appear where your customers are searching next.
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => openBooking("AI Visibility Strategy")}
                    className="px-12 py-5 bg-white text-ink rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:-translate-y-1"
                  >
                    Book a Strategic Call
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollSection>

      </main>
    </motion.div>
  );
};
