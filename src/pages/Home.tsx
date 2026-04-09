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
      hidden: { opacity: 0, scale: 0.96, y: 30, rotateX: 6 },
      visible: { 
        opacity: 1, 
        scale: 1,
        y: 0, 
        rotateX: 0,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      }
    }}
    className="group surface-plate px-6 py-5 md:px-7 md:py-6 transition-all duration-700 hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.06),0_40px_120px_-24px_rgba(0,0,0,0.08)] hover:-translate-y-1"
  >
    <div className="flex items-start gap-4">
      <div className="mt-1 shrink-0">
        <div className="w-2 h-2 rounded-full bg-ink/15 group-hover:bg-ink/40 transition-colors duration-500" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] md:text-base text-ink font-bold tracking-[-0.01em] mb-1.5 transition-colors duration-500 group-hover:text-black">
          {title}
        </h3>
        <p className="text-sm md:text-[15px] leading-relaxed text-ink/52 group-hover:text-ink/80 transition-colors duration-500 font-light">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

const roadmapContainerVariants = {
  hidden: { 
    opacity: 0, 
    y: 80, 
    rotateX: 8, 
    scale: 0.96 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    transition: { 
      duration: 1.4, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.2
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

        {/* Screen 1.5: Methodology / Off-Page Section */}
        <section className="relative py-32 md:py-48 bg-ink text-white overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>
          
          <div className="section-container relative z-10 w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-24 md:mb-32">
                <motion.span 
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/30 block mb-8"
                >
                  The New Ecosystem
                </motion.span>
                <motion.h2 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-4xl md:text-6xl font-nixie leading-[1.1] mb-8"
                >
                  AI Visibility is built <br />
                  <span className="text-white/40">beyond the page.</span>
                </motion.h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
                {[
                  {
                    title: "Off-Page Authority",
                    desc: "It's no longer just about your own site. We influence the sources AI models consume to define your brand identity.",
                    tag: "Authority"
                  },
                  {
                    title: "Neural Presence",
                    desc: "We ensure your brand exists within the context of the neural networks that define tomorrow's answers.",
                    tag: "Presence"
                  },
                  {
                    title: "Expert Execution",
                    desc: "Our methodology focuses on actions the market isn't taking, building a moat around your AI visibility.",
                    tag: "Differentiation"
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.98 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    className="surface-plate-dark p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-white/10 transition-colors"
                  >
                    <div className="text-[9px] uppercase tracking-widest font-bold text-white/20 mb-12 group-hover:text-white/40 transition-colors">
                      {item.tag}
                    </div>
                    <h3 className="text-xl md:text-2xl font-nixie mb-6">{item.title}</h3>
                    <p className="text-sm md:text-base font-light text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center pt-20 border-t border-white/5">
                <motion.h3 
                  variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                  className="text-2xl md:text-3xl font-nixie text-white tracking-tight"
                >
                  How we build our strategies
                </motion.h3>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Screen 2: Roadmap Section (Modular/Product Style) */}
        <section className="relative py-32 md:py-48 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
          
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1400px] mx-auto">
              {[
                {
                  step: "01",
                  title: "Onboarding",
                  desc: "We start by diving deep into your brand identity, business goals, and technical foundations to align our approach.",
                  icon: "Target"
                },
                {
                  step: "02",
                  title: "Prompt analysis",
                  desc: "We analyze thousands of industry-specific prompts to understand exactly how AI models perceive and categorize your sector.",
                  icon: "Search"
                },
                {
                  step: "03",
                  title: "Competitor analysis",
                  desc: "A surgical breakdown of why your competitors are winning (or losing) in AI answers, uncovering their source authority.",
                  icon: "Activity"
                },
                {
                  step: "04",
                  title: "Strategy building",
                  desc: "The culmination: a clear, actionable roadmap for dominant AI visibility across all major platforms.",
                  icon: "Layers"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="surface-plate p-10 md:p-12 rounded-[3rem] border border-black/[0.03] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-700"
                >
                  <div className="mb-16 flex justify-between items-start">
                    <span className="text-[11px] font-bold tracking-[0.3em] text-ink/10 group-hover:text-ink/30 transition-colors">
                      STG. {item.step}
                    </span>
                    <Hexagon size={12} outline className="text-ink/10 group-hover:text-ink/40 transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-nixie mb-6 text-ink">{item.title}</h3>
                  <p className="text-sm md:text-base font-light leading-relaxed text-ink/50 group-hover:text-ink/80 transition-colors">
                    {item.desc}
                  </p>

                  <div className="absolute -bottom-8 -right-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                    <Hexagon size={180} outline className="text-ink rotate-12" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Screen 3: Pricing Cards */}
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
              {/* Card 1 - Ongoing AI Visibility */}
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
                  {[
                    "Monthly AI tracking",
                    "Competitor tracking",
                    "Content opportunities",
                    "Citation opportunities",
                    "Monthly report",
                    "Dashboard access",
                    "Platform early access"
                  ].map(feature => (
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

              {/* Card 2 - AI Visibility Strategy */}
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
                  {[
                    "Industry AI analysis",
                    "Competitor visibility",
                    "Citation/source analysis",
                    "Page recommendations",
                    "Off-page opportunities",
                    "Positioning guide",
                    "Strategic roadmap"
                  ].map(feature => (
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

              {/* Card 3 - Strategy + Consulting (Featured) */}
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
                  {[
                    "Everything in Strategy",
                    "Consulting calls",
                    "Implementation guidance",
                    "Content prioritization",
                    "Follow-up recommendations"
                  ].map(feature => (
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

        {/* Screen 4: Platform / Early Access + Final CTA */}
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
