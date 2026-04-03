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

const RoadmapRevealText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
      visible: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const RoadmapItem = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 26, scale: 0.985 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }
      }
    }}
    className="group rounded-[1.75rem] bg-white/78 backdrop-blur-sm border border-ink/[0.05] px-6 py-5 md:px-7 md:py-6 transition-all duration-500 hover:border-ink/10 hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.035)]"
  >
    <div className="flex items-start gap-4">
      <div className="mt-1 shrink-0">
        <div className="w-2 h-2 rounded-full bg-ink/15 group-hover:bg-ink/30 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] md:text-base text-ink font-medium tracking-[-0.01em] mb-1.5">
          {title}
        </h3>
        <p className="text-sm md:text-[15px] leading-relaxed text-ink/52 group-hover:text-ink/68 transition-colors font-light">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

const roadmapContainerVariants = {
  hidden: { 
    opacity: 0, 
    y: 70, 
    rotateX: 10, 
    rotateZ: -1.8, 
    scale: 0.985 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    rotateZ: 0, 
    scale: 1,
    transition: { 
      duration: 1.35, 
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.06,
      delayChildren: 0.15
    }
  }
};

const pricingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const pricingCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const platformContainerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }
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
        {/* Screen 1: Hero Section (LOCKED) */}
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
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 pointer-events-none opacity-[0.35] blur-[100px] bg-radial-[circle_at_center,_black_0%,_transparent_80%] h-[150%] w-[150%] left-1/2 -translate-x-1/2" />
              <h1 className="text-4xl md:text-6xl font-nixie mb-8 tracking-tighter drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
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
              <p className="text-sm mb-12 font-light opacity-60 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                We analyze how AI models talk about your industry, competitors, and content, and build a strategy so your company appears in AI-generated answers.
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

        {/* Screen 2: What We Do (AI Visibility Strategy) */}
        <section className="relative py-28 md:py-40 bg-white border-b border-ink/5 overflow-hidden">
          <div className="absolute inset-0 -z-20 opacity-[0.05]">
            <Grainient
              color1="#000000"
              color2="#ffffff"
              color3="#808080"
              timeSpeed={0.05}
              warpStrength={0.22}
              zoom={2.2}
            />
          </div>

          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-x-[12%] top-[10%] h-[38%] rounded-full bg-white opacity-70 blur-[120px]" />
            <div className="absolute inset-x-[20%] bottom-[12%] h-[26%] rounded-full bg-ink/[0.025] blur-[120px]" />
          </div>

          <div className="section-container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={roadmapContainerVariants}
              viewport={{ once: true, margin: "-100px" }}
              style={{ 
                transformPerspective: 1800,
                transformOrigin: "center top",
                opacity: 0,
                willChange: "transform, opacity"
              }}
              className="relative max-w-[1180px] mx-auto"
            >
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/70 via-white/40 to-white/65 -z-10" />
              <div className="absolute inset-0 rounded-[3rem] border border-ink/[0.045] -z-10" />
              <div className="absolute inset-[2%] rounded-[2.6rem] border border-white/70 -z-10 opacity-70" />
              <div className="absolute inset-x-[18%] top-[12%] h-[26%] rounded-full bg-white opacity-70 blur-[90px] -z-10" />

              <div className="px-7 py-10 md:px-14 md:py-16 lg:px-20 lg:py-20">
                <RoadmapRevealText className="text-center mb-16 md:mb-20 relative">
                  <ReadabilityGlow />
                  <span className="text-[10px] font-bold tracking-[0.38em] text-ink/18 uppercase mb-6 block">
                    Our Approach
                  </span>

                  <h2 className="text-4xl md:text-6xl font-nixie leading-[1.02] mb-8 text-ink tracking-tight">
                    AI Visibility Strategy <br />& Roadmap
                  </h2>

                  <p className="text-xl text-ink/68 leading-relaxed font-light max-w-2xl mx-auto">
                    We analyze how AI models talk about your industry, competitors, and content, and build a strategy so your company appears in AI-generated answers.
                  </p>
                </RoadmapRevealText>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-5xl mx-auto mb-14 md:mb-16">
                  {[
                    {
                      title: "Competitor Analysis",
                      desc: "Identify which competitors appear in AI answers and why.",
                    },
                    {
                      title: "Influence Mapping",
                      desc: "Discover which websites and sources influence AI model outputs.",
                    },
                    {
                      title: "Content Audit",
                      desc: "Analyze what content currently appears in AI-generated answers.",
                    },
                    {
                      title: "Content Creation",
                      desc: "Define the specific content you need to create for AI visibility.",
                    },
                    {
                      title: "Page Optimization",
                      desc: "Build pages and comparisons specifically for AI model consumption.",
                    },
                    {
                      title: "Citation Strategy",
                      desc: "Determine where your brand should be mentioned across the web.",
                    },
                    {
                      title: "Strategic Roadmap",
                      desc: "A clear, actionable plan for long-term AI presence.",
                    },
                    {
                      title: "Brand Positioning",
                      desc: "How to position your company to be the preferred AI answer.",
                    },
                  ].map((item, i) => (
                    <RoadmapItem
                      key={i}
                      title={item.title}
                      desc={item.desc}
                    />
                  ))}
                </div>

                <RoadmapRevealText className="text-center">
                  <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/72 backdrop-blur-sm border border-ink/[0.05] shadow-[0_8px_24px_rgba(0,0,0,0.025)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/20 animate-pulse" />
                    <p className="text-ink/42 font-mono text-[10px] uppercase tracking-[0.45em]">
                      Strategic Roadmap • Data-Driven Execution
                    </p>
                  </div>
                </RoadmapRevealText>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Screen 3: Pricing Cards */}
        <ScrollSection className="py-32 md:py-48 tonal-plane" speed={1.2}>
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
              {/* Card 1 - Ongoing AI Visibility */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 rounded-[3rem] border border-ink/5 bg-white hover:border-ink/20 transition-all duration-700 flex flex-col hover:shadow-[0_20px_80px_rgba(0,0,0,0.03)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-surface-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/30 mb-6 group-hover:text-ink/60 transition-colors">Ongoing AI Visibility</h3>
                  <div className="text-6xl font-nixie text-ink">$290<span className="text-lg font-sans text-ink/30 ml-3">/mo</span></div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {[
                    "Monthly AI visibility tracking",
                    "Competitor tracking",
                    "New content opportunities",
                    "New citation opportunities",
                    "Monthly report",
                    "Dashboard access",
                    "Early access to platform"
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-ink/50 font-light group-hover:text-ink/80 transition-colors">
                      <Hexagon size={6} className="bg-ink/10 group-hover:bg-ink/30 transition-colors" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={goToApp}
                  className="w-full py-5 rounded-2xl border border-ink/10 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-all duration-500"
                >
                  Start Monitoring
                </button>
              </motion.div>

              {/* Card 2 - AI Visibility Strategy */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 rounded-[3rem] border border-ink/5 bg-white hover:border-ink/20 transition-all duration-700 flex flex-col hover:shadow-[0_20px_80px_rgba(0,0,0,0.03)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-surface-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/30 mb-6 group-hover:text-ink/60 transition-colors">AI Visibility Strategy</h3>
                  <div className="text-6xl font-nixie text-ink">$490</div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {[
                    "Industry AI analysis",
                    "Competitor visibility analysis",
                    "Citation and source analysis",
                    "Content and page recommendations",
                    "Off-page / citation opportunities",
                    "Positioning recommendations",
                    "Strategic roadmap"
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-ink/50 font-light group-hover:text-ink/80 transition-colors">
                      <Hexagon size={6} className="bg-ink/10 group-hover:bg-ink/30 transition-colors" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="w-full py-5 rounded-2xl border border-ink/10 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-all duration-500"
                >
                  Get Strategy
                </button>
              </motion.div>

              {/* Card 3 - Strategy + Consulting (Featured) */}
              <motion.div 
                variants={pricingCardVariants}
                className="p-12 rounded-[3rem] border border-ink bg-ink text-white transition-all duration-700 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.15)] scale-105 z-10 hover:scale-[1.08] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                <div className="mb-12">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mb-6">Strategy + Consulting</h3>
                  <div className="text-6xl font-nixie">$890</div>
                </div>
                <ul className="space-y-5 mb-14 flex-grow">
                  {[
                    "Everything in Strategy",
                    "Consulting calls",
                    "Implementation guidance",
                    "Content prioritization",
                    "Follow-up recommendations"
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-sm text-white/50 font-light">
                      <Hexagon size={6} className="bg-white/20" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openBooking("Strategy + Consulting")}
                  className="w-full py-5 rounded-2xl bg-white text-ink font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-500"
                >
                  Get Strategy + Consulting
                </button>
              </motion.div>
            </motion.div>
          </div>
        </ScrollSection>

        {/* Screen 4: Platform / Early Access + Final CTA */}
        <ScrollSection className="py-40 md:py-64 bg-white relative overflow-hidden" speed={0.6}>
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

          <div className="section-container relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={platformContainerVariants}
              viewport={{ once: true, margin: "-80px" }}
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-w-4xl mx-auto text-center relative"
            >
              <ReadabilityGlow />
              <div className="flex justify-center mb-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="absolute inset-0 blur-2xl bg-ink/5 rounded-full" />
                  <Hexagon size={64} outline className="text-ink/10 relative z-10" />
                </motion.div>
              </div>
              
              <h2 className="text-5xl md:text-8xl font-nixie text-ink leading-[0.9] mb-16 tracking-tighter">
                The Platform <br />is Coming.
              </h2>
              
              <p className="text-2xl text-ink/40 font-light mb-20 max-w-2xl mx-auto leading-relaxed">
                Be-Visible is also building a platform where companies can track their AI visibility, competitors, citations, and content opportunities over time.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="px-14 py-6 bg-ink text-white rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-ink/90 transition-all shadow-2xl shadow-ink/20 hover:-translate-y-1"
                >
                  Get Early Access
                </button>
                <button 
                  onClick={() => openBooking("AI Visibility Strategy")}
                  className="px-14 py-6 border border-ink/10 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-surface-50 transition-all text-ink/40 hover:text-ink hover:-translate-y-1"
                >
                  Get Started
                </button>
              </div>

              <div className="mt-40 flex flex-wrap justify-center gap-x-16 gap-y-8">
                {["Intelligence", "Visibility", "Authority", "Presence"].map((word, i) => (
                  <motion.div 
                    key={word} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 1, ease: "easeOut" }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/5" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.5em] text-ink/10">{word}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </ScrollSection>

      </main>
    </motion.div>
  );
};
