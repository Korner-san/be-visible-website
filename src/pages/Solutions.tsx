import React from "react";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";
import { Hexagon } from "../components/Hexagon";

const solutionsData = {
  presence: {
    title: "Presence Analysis",
    description: "We analyze how AI models talk about your industry, competitors, and content.",
    features: [
      { title: "Competitor Visibility", desc: "Understand which competitors appear in AI answers and why they are being chosen." },
      { title: "Industry Mapping", desc: "Map the semantic landscape of your industry to identify visibility gaps." },
      { title: "Citation Analysis", desc: "Analyze which websites and sources are influencing AI responses for your brand." },
      { title: "Content Audit", desc: "Evaluate your current content's effectiveness for AI model retrieval." }
    ]
  },
  comparison: {
    title: "Market Comparison",
    description: "Benchmark your brand against industry leaders in the generative AI era.",
    features: [
      { title: "Share of Voice", desc: "Compare your brand's percentage of mentions relative to all other identified entities." },
      { title: "Source Influence", desc: "Identify the authoritative sources that AI models prefer for your competitors." },
      { title: "Gap Analysis", desc: "Find the specific topics and keywords where your competitors are outperforming you." },
      { title: "Trend Tracking", desc: "Monitor how AI model preferences shift between you and your rivals over time." }
    ]
  },
  prompts: {
    title: "Strategic Roadmap",
    description: "We don’t just give data — we give a clear roadmap of what to do next.",
    features: [
      { title: "Content Recommendations", desc: "Specific guidance on what content to create to improve AI visibility." },
      { title: "Page Optimization", desc: "Instructions on how to structure your pages for better AI understanding." },
      { title: "Citation Strategy", desc: "A plan for where your brand should be mentioned online to build authority." },
      { title: "Positioning Roadmap", desc: "A step-by-step guide to positioning your company as the top choice for AI." }
    ]
  },
  citations: {
    title: "Source Influence",
    description: "Identify and influence the websites that AI models use as sources for their answers.",
    features: [
      { title: "Influencer Mapping", desc: "Identify the key websites and domains that AI models cite most frequently." },
      { title: "Citation Opportunities", desc: "Find new places where your brand can be mentioned to boost AI authority." },
      { title: "Link Strategy", desc: "Develop a strategy to secure mentions on high-influence AI source sites." },
      { title: "Authority Building", desc: "Measure and grow the perceived authority of your brand's digital footprint." }
    ]
  }
};

export const Solutions = () => {
  const { type } = useParams();
  const solution = solutionsData[type as keyof typeof solutionsData];

  if (!solution) return <div className="pt-40 text-center font-nixie text-2xl">Solution not found</div>;

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 md:pt-56 pb-32"
    >
      <div className="section-container">
        <div className="max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold tracking-[0.2em] text-ink/40 uppercase mb-6 block"
          >
            Solutions / {solution.title}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-nixie mb-12 text-ink leading-[0.9]"
          >
            {solution.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-ink/60 font-light leading-relaxed mb-20 max-w-2xl"
          >
            {solution.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {solution.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-[2rem] bg-surface-50 border border-ink/5 hover:border-ink/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <Hexagon size={32} outline className="text-ink/20 group-hover:text-ink transition-colors" />
                <span className="text-[10px] font-mono text-ink/20">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-nixie mb-4 text-ink">{feature.title}</h3>
              <p className="text-sm text-ink/50 font-light leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aspect-video rounded-[3rem] bg-ink overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Hexagon size={64} outline className="text-white/20 mb-8 mx-auto" />
              <p className="text-white/40 font-mono text-[10px] tracking-[0.4em] uppercase">Interactive Visualization</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-12 left-12 w-px h-24 bg-white/10" />
          <div className="absolute top-12 left-12 w-24 h-px bg-white/10" />
          <div className="absolute bottom-12 right-12 w-px h-24 bg-white/10" />
          <div className="absolute bottom-12 right-12 w-24 h-px bg-white/10" />
        </motion.div>
      </div>
    </motion.div>
  );
};
