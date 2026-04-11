import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { Hexagon } from "../components/Hexagon";
import { useNavigate } from "react-router-dom";
import Grainient from "../components/Grainient";
import { useBooking } from "../App";

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

// ─── CAPABILITY PANEL ────────────────────────────────────────────────────────
const CapabilityPanel = ({
  label,
  title,
  desc,
  index,
}: {
  label: string;
  title: string;
  desc: string;
  index: number;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 32, scale: 0.97 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }
      }
    }}
    className="group relative rounded-[2rem] border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm px-8 py-8 overflow-hidden transition-all duration-700 hover:border-white/[0.15] hover:bg-white/[0.07]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
    <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20 block mb-5">{label}</span>
    <h3 className="text-[17px] font-bold text-white leading-snug mb-3 tracking-[-0.01em]">{title}</h3>
    <p className="text-[14px] font-light text-white/40 leading-relaxed">{desc}</p>
  </motion.div>
);

// ─── ROADMAP STAGE ────────────────────────────────────────────────────────────
const RoadmapStage = ({
  step,
  title,
  desc,
  items,
  isLast,
}: {
  step: string;
  title: string;
  desc: string;
  items: string[];
  isLast?: boolean;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    }}
    className="relative flex gap-8 md:gap-12"
  >
    {/* Left: Step indicator + connector line */}
    <div className="flex flex-col items-center flex-shrink-0 w-10">
      <div className="w-10 h-10 rounded-full border border-ink/15 bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-10">
        <span className="text-[10px] font-bold tracking-wider text-ink/40">{step}</span>
      </div>
      {!isLast && (
        <div className="flex-1 w-px bg-gradient-to-b from-ink/10 to-transparent mt-3 min-h-[80px]" />
      )}
    </div>

    {/* Right: Content */}
    <div className={`flex-1 pb-16 ${isLast ? "" : ""}`}>
      <div className="group rounded-[2rem] border border-ink/[0.06] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-1 px-8 py-8 md:px-10 md:py-9 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent pointer-events-none opacity-60" />
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-2">{title}</h3>
          <p className="text-sm text-ink/50 font-light leading-relaxed mb-6 max-w-xl">{desc}</p>
          <ul className="flex flex-wrap gap-2">
            {items.map(item => (
              <li key={item} className="text-[11px] font-medium text-ink/50 tracking-wide bg-ink/[0.04] px-3 py-1.5 rounded-full border border-ink/[0.06] group-hover:border-ink/10 transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </motion.div>
);

const roadmapContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const pricingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const pricingCardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, rotateX: 5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

const platformContainerVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export const Home = () => {
  const navigate = useNavigate();
  const { openBooking } = useBooking();
  const [modelIndex, setModelIndex] = useState(0);
  const models = ["ChatGPT", "Claude", "Gemini", "Grok"];

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

  const goToApp = () => {
    window.open("https://app.be-visible.ai/", "_blank");
  };

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
                <span className="relative inline-block min-w-[100px] text-left h-[1.2em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={models[modelIndex]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      {models[modelIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>
              {/* ── UPDATED HERO SUPPORTING SENTENCE ── */}
              <p className="text-sm mb-12 font-light opacity-60 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                We track and analyze how AI models talk about your brand, industry, and competitors, and build a strategy so your company appears on AI search platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white border-2 border-white transition-all"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="bg-transparent text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black border-2 border-white transition-all"
                >
                  Get Early Access
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── BLACK SECTION: OFF-PAGE PROCESS + TRANSITION ───────────────────── */}
        <section className="relative bg-ink text-white overflow-hidden">
          {/* Subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />
          {/* Soft ambient top glow bleeding from hero */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          <div className="section-container relative z-10 py-32 md:py-48">

            {/* ── SECTION LABEL ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
              className="text-center mb-20 md:mb-24"
            >
              <span className="text-[9px] font-bold tracking-[0.55em] uppercase text-white/25 block mb-6">
                The New Reality
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-nixie leading-[1.04] tracking-tight max-w-4xl mx-auto">
                AI visibility is not built <br />
                <span className="text-white/25">through your website alone.</span>
              </h2>
            </motion.div>

            {/* ── CAPABILITY PANELS ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
            >
              <CapabilityPanel
                index={0}
                label="Off-page signals"
                title="Citations across the web shape AI answers"
                desc="AI models learn from what trusted websites, publications, and forums say about your brand — not only your own pages."
              />
              <CapabilityPanel
                index={1}
                label="Prompt ecosystem"
                title="Your competitors are already inside the answer"
                desc="When users ask AI about your industry, someone appears. We analyze exactly who, how, and why — then build a path so it becomes you."
              />
              <CapabilityPanel
                index={2}
                label="Our edge"
                title="We specialize where most strategies stop"
                desc="Most SEO and content agencies stop at your site. We go further — analyzing citations, source influence, and AI training signals your competitors are missing."
              />
            </motion.div>

            {/* ── SECONDARY ROW: TWO PANELS ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28 md:mb-40"
            >
              <CapabilityPanel
                index={0}
                label="Source influence"
                title="We map which sources shape what AI recommends"
                desc="Our process identifies the exact websites, domains, and publications that influence AI model outputs in your niche — and builds a presence strategy around them."
              />
              <CapabilityPanel
                index={1}
                label="Strategic output"
                title="A clear strategy. Not just a report."
                desc="We deliver a complete, actionable playbook — covering on-page structure, off-page citation targets, positioning priorities, and a staged execution roadmap."
              />
            </motion.div>

            {/* ── DESIGNED TRANSITION MOMENT ── */}
          </div>
          
          <div className="relative w-full pt-20 pb-40 md:pt-32 md:pb-64 overflow-hidden">
            {/* Architectural Background Tonal Fade */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-surface-50" />
              {/* Deep engineered fade of the dark section downwards */}
              <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 via-[45%] to-transparent" />
              {/* Soft upward push of the light section to cushion the meeting point */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface-50 via-surface-50/80 via-[40%] to-transparent" />
            </div>

            {/* Scroll-Choreographed Foreground Text */}
            <ScrollSection speed={0.3} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              {/* Premium hanging connector line */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { height: 0, opacity: 0 },
                  visible: { height: 120, opacity: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="w-px bg-gradient-to-b from-white/30 via-white/5 to-transparent mx-auto mb-16 origin-top"
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
              >
                <motion.span
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: "easeOut" } } }}
                  className="text-[10px] font-bold tracking-[0.55em] uppercase text-white/50 block mb-6 drop-shadow-sm"
                >
                  Our Process
                </motion.span>
                
                <motion.h2
                  variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } } }}
                  className="text-4xl md:text-6xl lg:text-7xl font-nixie tracking-tighter text-white mb-8 drop-shadow-xl"
                >
                  How we build our strategies
                </motion.h2>
                
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } } }}
                  className="relative max-w-xl mx-auto"
                >
                  {/* Ultra-soft localized atmospheric shadow to ensure readability without forming a hard box */}
                  <div className="absolute inset-0 bg-black/30 blur-[24px] scale-[1.3] -z-10 rounded-[3rem] pointer-events-none" />
                  <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    A structured methodology that turns AI citation data into an actionable, measurable visibility plan.
                  </p>
                </motion.div>
              </motion.div>
            </ScrollSection>
          </div>
        </section>

        {/* ── LIGHT SECTION: VERTICAL ROADMAP ──────────────────────────────── */}
        <section className="relative bg-surface-50 overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.6] mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 -z-20 opacity-[0.04]">
            <Grainient
              color1="#000000"
              color2="#ffffff"
              color3="#808080"
              timeSpeed={0.05}
              warpStrength={0.22}
              zoom={2.2}
            />
          </div>

          <div className="section-container py-28 md:py-40">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={roadmapContainerVariants}
              className="max-w-2xl mx-auto"
            >
              <RoadmapStage
                step="01"
                title="Onboarding"
                desc="We align on your brand, positioning, target audience, and core competitors to establish a clear strategic baseline."
                items={["Brand positioning", "Competitor identification", "Target market clarity", "Initial AI snapshot"]}
              />
              <RoadmapStage
                step="02"
                title="Prompt analysis"
                desc="We systematically test how AI models respond to the prompts your potential customers are actually asking — and map where you stand."
                items={["Prompt landscape mapping", "Mention rate analysis", "Share of voice scoring", "AI model coverage"]}
              />
              <RoadmapStage
                step="03"
                title="Competitor analysis"
                desc="We identify which competitors appear in AI answers, what content they have, and which off-page sources are elevating their visibility."
                items={["Competitor mention tracking", "Source & citation mapping", "Content gap identification", "Positioning benchmark"]}
              />
              <RoadmapStage
                step="04"
                title="Strategy building"
                desc="We synthesize everything into a complete, executable AI visibility roadmap — covering content, citations, positioning, and off-page priorities."
                items={["Strategic roadmap", "Content priorities", "Citation targets", "Off-page action plan"]}
                isLast
              />
            </motion.div>

            {/* CTA after roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-center mt-20"
            >
              <button
                onClick={() => openBooking("AI Visibility Strategy")}
                className="px-12 py-5 bg-ink text-white rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-ink/90 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1"
              >
                Start with a Strategy
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <ScrollSection className="py-32 md:py-48 bg-surface-50 border-b border-ink/[0.04]" speed={1.2}>
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.8] mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 -z-20 opacity-[0.03]">
            <Grainient 
              color1="#000000"
              color2="#ffffff"
              color3="#f0f0f0"
              timeSpeed={0.04}
              warpStrength={0.2}
              zoom={2.2}
            />
          </div>

          <FloatingHex scrollYProgress={scrollYProgress} index={3} offset={200} />

          <div className="section-container relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={pricingContainerVariants}
              style={{ opacity: 0, willChange: "opacity" }}
              className="text-center mb-24 relative"
            >
              <ReadabilityGlow />
              <span className="text-[10px] font-bold tracking-[0.4em] text-ink/30 uppercase mb-6 block">Investment</span>
              <h2 className="text-4xl md:text-6xl font-nixie text-ink tracking-tight">Simple, Transparent Pricing</h2>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={pricingContainerVariants}
              style={{ opacity: 0, willChange: "opacity" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
            >
              {/* Card 1 */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 surface-plate transition-all duration-700 flex flex-col hover:-translate-y-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/40 mb-6 group-hover:text-ink/80 transition-colors">Ongoing AI Visibility</h3>
                  <div className="flex items-baseline gap-1"><span className="text-5xl font-nixie text-ink">$290</span><span className="text-sm font-sans text-ink/40 ml-1 font-normal">/mo</span></div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {["Monthly AI tracking","Competitor tracking","Content opportunities","Citation opportunities","Monthly report","Dashboard access","Platform early access"].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-ink/60 font-light group-hover:text-ink/90 transition-colors">
                      <Hexagon size={6} className="bg-ink/15 group-hover:bg-ink/40 transition-colors" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={goToApp}
                  className="w-full py-5 rounded-2xl border border-ink/[0.08] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-all duration-500 shadow-sm"
                >
                  Start Monitoring
                </button>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 surface-plate transition-all duration-700 flex flex-col hover:-translate-y-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/40 mb-6 group-hover:text-ink/80 transition-colors">AI Visibility Strategy</h3>
                  <div className="text-5xl font-nixie text-ink">$490</div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {["Industry AI analysis","Competitor visibility","Citation/source analysis","Page recommendations","Off-page opportunities","Positioning guide","Strategic roadmap"].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-ink/60 font-light group-hover:text-ink/90 transition-colors">
                      <Hexagon size={6} className="bg-ink/15 group-hover:bg-ink/40 transition-colors" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="w-full py-5 rounded-2xl border border-ink/[0.08] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-all duration-500 shadow-sm"
                >
                  Get Strategy
                </button>
              </motion.div>

              {/* Card 3 - Featured */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 surface-plate-dark transition-all duration-700 flex flex-col group hover:-translate-y-2 scale-[1.02] hover:scale-[1.04] z-10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/50 mb-6 group-hover:text-white/80 transition-colors">Strategy + Consulting</h3>
                  <div className="text-5xl font-nixie text-white">$890</div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {["Everything in Strategy","Consulting calls","Implementation guidance","Content prioritization","Follow-up recommendations"].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-white/70 font-light group-hover:text-white transition-colors">
                      <Hexagon size={6} className="bg-white/30 group-hover:bg-white/50 transition-colors" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openBooking("Strategy + Consulting")}
                  className="w-full py-5 rounded-2xl bg-white text-ink font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-surface-100 transition-all duration-500 shadow-lg"
                >
                  Get Strategy + Consulting
                </button>
              </motion.div>
            </motion.div>
          </div>
        </ScrollSection>

        {/* ── PLATFORM CTA ──────────────────────────────────────────────────── */}
        <ScrollSection className="py-40 md:py-64 bg-surface-50 relative overflow-hidden" speed={0.6}>
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.8] mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 -z-20 opacity-[0.06]">
            <Grainient 
              color1="#000000"
              color2="#ffffff"
              color3="#404040"
              timeSpeed={0.12}
              warpStrength={0.9}
              zoom={1.1}
            />
          </div>

          <FloatingHex scrollYProgress={scrollYProgress} index={4} offset={-250} />
          <FloatingHex scrollYProgress={scrollYProgress} index={5} offset={300} />

          <div className="section-container relative z-10 w-full px-4 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={platformContainerVariants}
              viewport={{ once: true, margin: "-80px" }}
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-w-6xl mx-auto text-center relative surface-plate-dark overflow-hidden rounded-[3rem] md:rounded-[4.5rem] px-6 py-24 md:py-36 shadow-[0_40px_160px_-20px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-6xl md:text-8xl lg:text-[8rem] font-nixie text-white leading-[0.9] mb-12 tracking-tighter">
                  The Platform <br />
                  <span className="text-white/20">is Coming.</span>
                </h2>
                
                <p className="text-2xl text-white/40 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
                  Be-Visible is also building a platform where companies can track their AI visibility, competitors, citations, and content opportunities over time.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button 
                    onClick={() => openBooking("AI Visibility Strategy")}
                    className="px-12 py-5 bg-white text-ink rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:-translate-y-1"
                  >
                    Get Early Access
                  </button>
                  <button 
                    onClick={() => openBooking("AI Visibility Strategy")}
                    className="px-12 py-5 border border-white/10 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-white/40 hover:text-white hover:-translate-y-1"
                  >
                    Get Started
                  </button>
                </div>

                <div className="mt-32 md:mt-40 flex flex-wrap justify-center gap-x-12 gap-y-8">
                  {["Intelligence", "Visibility", "Authority", "Presence"].map((word, i) => (
                    <motion.div 
                      key={word} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="text-[11px] font-mono uppercase tracking-[0.5em] text-white/20">{word}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollSection>

      </main>
    </motion.div>
  );
};
