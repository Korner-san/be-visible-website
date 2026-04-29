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

const rawTokens = "See exactly how ChatGPT, Claude, and Google AI Overview rank your brand. Be-Visible reveals your share of voice, extracts AI sentiment, and shows you exactly what it takes to own the AI recommendations in your industry.".split(" ");
const totalWords = rawTokens.filter(t => t !== "<br>").length;

const NativeWordReveal = ({ word, index, total, progress }: { word: string, index: number, total: number, progress: any }) => {
  const start = index / total;
  const end = (index + 1) / total;
  
  // y physical movement
  const y = useTransform(progress, [start, end], ["100%", "0%"]);
  
  // clip-path mathematical mapping based on the exact string-tune reference
  const wordProgress = useTransform(progress, [start, end], [0, 1]);
  const clipPath = useTransform(wordProgress, (val) => {
    // clamp between 0 and 1 just in case, though framer-motion does it
    const clampedVal = Math.max(0, Math.min(1, val));
    return `inset(-15% 0 calc(115% - ${clampedVal} * 130%) 0)`;
  });
  
  return (
    // Parent wrapper with overflow-hidden as requested
    <span className="inline-block relative overflow-hidden pb-2 -mb-2">
      <motion.span style={{ y, clipPath }} className="inline-block will-change-transform">
        {word}
      </motion.span>
    </span>
  );
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

  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: s2Progress } = useScroll({
    target: section2Ref,
    offset: ["start end", "start start"]
  });
  const s2Y = useTransform(s2Progress, [0, 1], ["-50vh", "0vh"]);
  const s2Opacity = useTransform(s2Progress, [0, 1], [1, 0]);

  // NATIVE TEXT REVEAL PROGRESS
  const { scrollYProgress: nativeProgress } = useScroll({
    target: section2Ref,
    offset: ["start start", "end end"]
  });

  const section3Ref = useRef<HTMLElement>(null);
  const { scrollYProgress: s3Progress } = useScroll({
    target: section3Ref,
    offset: ["start end", "start start"]
  });
  const s3Y = useTransform(s3Progress, [0, 1], ["-50vh", "0vh"]);
  const s3Opacity = useTransform(s3Progress, [0, 1], [1, 0]);

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
        <section className="relative z-20 h-screen bg-black text-white text-center overflow-hidden flex items-center justify-center pt-20">
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
              
              <p className="text-sm mb-12 font-light opacity-80 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                Be-Visible is the intelligence platform for the zero-click era. We track how AI systems talk about your brand, analyze your competitive position, and execute the strategy to dominate AI-generated answers.
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
        <div ref={section2Ref} className="relative z-10 w-full overflow-clip bg-black">
          <motion.div style={{ y: s2Y }} className="relative w-full h-[400vh]">
            <motion.div style={{ opacity: s2Opacity }} className="absolute inset-0 z-[100] bg-black pointer-events-none" />
            
            <div className="sticky top-0 w-full h-screen flex flex-col items-start justify-center text-white px-4 md:px-12 max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-light text-left mb-8 md:mb-10 w-full leading-[1.2] z-10 opacity-90">
                Enterprise-grade AI visibility.
              </h2>
              <div className="flex flex-wrap justify-start gap-x-3 gap-y-0 text-2xl md:text-4xl font-light w-full text-left leading-[1.1] z-10">
                {(() => {
                  let wordIndex = 0;
                  return rawTokens.map((token, i) => {
                    if (token === "<br>") return <div key={i} className="w-full h-4 md:h-8" />;
                    const currentIndex = wordIndex++;
                    return (
                      <NativeWordReveal 
                        key={i} 
                        word={token} 
                        index={currentIndex} 
                        total={totalWords} 
                        progress={nativeProgress} 
                      />
                    );
                  });
                })()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 3: ROADMAP ───────────────────────────────────────── */}
        <section ref={section3Ref} className="relative bg-surface-50 overflow-clip">
          <motion.div style={{ y: s3Y }} className="relative w-full">
            <motion.div style={{ opacity: s3Opacity }} className="absolute inset-0 z-[100] bg-black pointer-events-none" />
            
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.6] mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 -z-20 opacity-[0.04]">
              <Grainient color1="#000000" color2="#ffffff" color3="#808080" timeSpeed={0.05} warpStrength={0.22} zoom={2.2} />
            </div>

            <div className="section-container pt-32 md:pt-48 pb-32">
              <div className="text-center mb-16 md:mb-24 px-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-6">Process</span>
                <h2 className="text-5xl md:text-7xl font-nixie text-ink tracking-tight">How we build our strategies.</h2>
                <div className="w-px h-24 bg-ink/10 mx-auto mt-12 mb-4"></div>
              </div>
              
              <div className="max-w-3xl mx-auto w-full relative group">
                <ScrollStack useWindowScroll={true}>
                  <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                      <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Phase 1</span>
                      <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">Analyzing data</h3>
                      <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                        We deeply learn about your brand and positioning, then rigorously map your entire competitive landscape to find your structural gaps.
                      </p>
                  </ScrollStackItem>
                  <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                      <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Phase 2</span>
                      <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">Content synthesis</h3>
                      <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                        We isolate the exact entities, citations, and semantic gaps preventing AI models from recommending you.
                      </p>
                  </ScrollStackItem>
                  <ScrollStackItem itemClassName="bg-white border border-ink/[0.06] flex flex-col justify-center transition-colors hover:border-ink/10">
                      <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-ink/30 block mb-4">Phase 3</span>
                      <h3 className="text-3xl md:text-4xl font-nixie text-ink tracking-tight mb-4">Technical alignment</h3>
                      <p className="text-lg md:text-xl text-ink/60 font-light leading-relaxed max-w-lg">
                        We deploy code-level optimizations to ensure AI crawlers ingest your narrative perfectly, exactly when it matters.
                      </p>
                  </ScrollStackItem>
                </ScrollStack>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 4: PRODUCT SHOWCASE ───────────────────────────────────────────── */}
        <ScrollSection className="py-32 md:py-48 bg-ink text-white relative overflow-hidden" speed={0.8}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />
          <div className="section-container relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
            
            <div className="mb-24 max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-nixie tracking-tight mb-8">
                Understand how AI is<br/>talking about your brand.
              </h2>
              <p className="text-xl text-white/50 font-light max-w-2xl leading-relaxed">
                Track your AI visibility, see where and how AI mentions your brand, and uncover insights to enhance your presence.
              </p>
            </div>

            {/* 4 Feature Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 border-t border-white/10 pt-16">
              {[
                { title: "Monitor Share of Voice", desc: "See exactly how often your brand is recommended by AI." },
                { title: "Track Custom Prompts", desc: "Identify the exact, high-value questions your customers ask." },
                { title: "Analyze Source Citations", desc: "Find out which websites train AI models answering about you." },
                { title: "Benchmark Competitors", desc: "See exactly where you lose visibility to industry leaders." }
              ].map((ft, i) => (
                <div key={i} className="border-l border-white/10 pl-6 relative">
                  <div className="absolute -left-[1px] top-0 h-6 w-[2px] bg-[#00E599]" />
                  <h4 className="text-lg font-bold mb-3">{ft.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed font-light">{ft.desc}</p>
                </div>
              ))}
            </div>

            {/* Premium Dashboard UI Mockup */}
            <div className="w-full bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,1)] flex flex-col md:flex-row h-auto md:h-[600px]">
              
              {/* Sidebar */}
              <div className="w-full md:w-64 border-r border-white/5 p-6 flex flex-col gap-4 bg-[#0A0A0A]">
                <div className="flex items-center gap-3 mb-10 mt-2">
                  <div className="w-7 h-7 rounded border border-white/20 bg-white/5 text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm">Bv</div>
                  <span className="font-bold tracking-widest text-[#00E599] text-[13px] uppercase">Be-Visible</span>
                </div>
                {['Dashboard', 'Prompts', 'Competitors', 'Models', 'Settings'].map(item => (
                  <div key={item} className="text-sm text-white/40 hover:text-white cursor-pointer py-1.5 font-medium transition-colors">{item}</div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-black">
                {/* Subtle gradient glow inside dashboard */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E599]/[0.03] rounded-full blur-[120px] pointer-events-none" />
                
                <div className="flex items-center gap-2 text-xs text-white/40 mb-8 font-mono relative z-10">
                  <span>Client Profile</span> <span className="opacity-50">/</span> <span>Share of Voice</span>
                </div>
                
                <h3 className="text-4xl font-bold mb-8 relative z-10 text-white/90">Category: Automation</h3>
                
                <div className="flex flex-wrap gap-4 mb-14 relative z-10">
                  <div className="px-5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors rounded-lg text-sm text-white/70 cursor-pointer">Last 24 hours</div>
                  <div className="px-5 py-2.5 bg-white/[0.08] border border-white/10 transition-colors rounded-lg text-sm text-white font-medium shadow-sm">Last 7 days</div>
                  <div className="px-5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors rounded-lg text-sm text-white/70 cursor-pointer">Last 30 days</div>
                  <div className="px-5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors rounded-lg text-sm text-white/70 cursor-pointer flex items-center gap-2 ml-4">Custom range <span className="opacity-50 text-[10px]">▼</span></div>
                </div>

                <div className="text-[13px] font-bold text-white/80 mb-6 relative z-10">Visibility overview</div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 relative z-10">
                  
                  {/* Left: Line Chart Mockup */}
                  <div className="border border-white/5 rounded-2xl p-8 bg-white/[0.01] flex flex-col relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="text-[13px] text-white/90 mb-8 font-medium">Share of Voice by Model</div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-4 mb-12 text-xs">
                      <div className="flex flex-col gap-1.5"><div className="flex items-center gap-2 text-white/50"><div className="w-2 h-2 rounded-[2px] bg-[#A855F7]"></div>ChatGPT</div> <div className="text-lg font-mono font-bold">89.2% <span className="text-[#00E599] text-[11px] ml-1 tracking-widest leading-none align-middle">+5%</span></div></div>
                      <div className="flex flex-col gap-1.5"><div className="flex items-center gap-2 text-white/50"><div className="w-2 h-2 rounded-[2px] bg-[#3B82F6]"></div>Claude 3</div> <div className="text-lg font-mono font-bold">73.4% <span className="text-[#00E599] text-[11px] ml-1 tracking-widest leading-none align-middle">+3%</span></div></div>
                      <div className="flex flex-col gap-1.5"><div className="flex items-center gap-2 text-white/50"><div className="w-2 h-2 rounded-[2px] bg-[#F59E0B]"></div>Google AI Overview</div> <div className="text-lg font-mono font-bold">50.5% <span className="text-red-400 text-[11px] ml-1 tracking-widest leading-none align-middle">-7%</span></div></div>
                    </div>
                    {/* SVG Line Chart */}
                    <div className="w-full flex-1 relative min-h-[180px] flex items-end">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[1, 2, 3, 4].map((line, i) => (
                           <div key={i} className="w-full flex items-center gap-4">
                             <div className="text-[9px] text-white/20 font-mono w-6">{100 - (i * 25)}%</div>
                             <div className="h-px bg-white/[0.04] flex-1"></div>
                           </div>
                        ))}
                      </div>
                      <div className="pl-10 w-full h-full relative">
                        <svg className="w-full h-[calc(100%-8px)] overflow-visible absolute bottom-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,80 L10,70 L20,70 L30,40 L40,60 L50,80 L60,85 L70,30 L80,30 L90,65 L100,50" fill="none" stroke="#A855F7" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                          <path d="M0,45 L15,60 L25,50 L40,75 L60,55 L75,80 L85,80 L100,20" fill="none" stroke="#3B82F6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                          <path d="M0,60 L20,30 L30,40 L50,20 L60,45 L80,20 L90,60 L100,60" fill="none" stroke="#F59E0B" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                          
                          {/* Data points */}
                          <circle cx="100" cy="50" r="3" fill="#A855F7" />
                          <circle cx="100" cy="20" r="3" fill="#3B82F6" />
                          <circle cx="100" cy="60" r="3" fill="#F59E0B" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-6 left-10 right-0 flex justify-between text-[9px] text-white/30 font-mono uppercase tracking-widest">
                        <span>Apr 12</span>
                        <span>Apr 14</span>
                        <span>Apr 16</span>
                        <span>Apr 18</span>
                        <span>Apr 20</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Bar/List Mockup */}
                  <div className="border border-white/5 rounded-2xl p-8 bg-white/[0.01] flex flex-col relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                     <div className="text-[13px] text-white/90 mb-10 font-medium">High-Value Prompts</div>
                     <div className="space-y-8 flex-1">
                       {[
                         { name: '"best platforms for enterprise AI"', val: 88, w: "90%" },
                         { name: '"top tools for brand visibility"', val: 64, w: "65%" },
                         { name: '"how to track LLM mentions"', val: 45, w: "45%" },
                         { name: '"competitor ranking software"', val: 32, w: "30%" },
                       ].map((theme, i) => (
                         <div key={i} className="flex flex-col gap-3">
                           <div className="flex justify-between text-[13px] text-white/70">
                             <span className="flex items-center gap-4"><span className="text-white/30 text-[10px]">{i+1}</span> {theme.name}</span>
                             <span className="font-mono">{theme.val}</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[#00E599] rounded-full shadow-[0_0_10px_rgba(0,229,153,0.5)]" style={{ width: theme.w }}></div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                </div>
              </div>
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
                  Over 100 million people use AI to discover new products. Be-Visible ensures your brand is the one they find.
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
