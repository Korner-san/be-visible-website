import React from "react";
import { motion } from "motion/react";
import { Hexagon } from "../components/Hexagon";
import { useBooking } from "../App";

export const Pricing = () => {
  const { openBooking } = useBooking();

  const goToApp = () => {
    window.open("https://app.be-visible.ai/", "_blank");
  };

  const plans = [
    {
      name: "Ongoing AI Visibility",
      price: "$290",
      period: "/mo",
      description: "Real-time monitoring and visibility tracking across all major AI models.",
      features: [
        "Daily Visibility Score",
        "Competitor Benchmarking",
        "Mention Rate Tracking",
        "Share of Voice Analysis"
      ],
      buttonText: "Start Monitoring",
      action: goToApp,
      highlight: false
    },
    {
      name: "AI Visibility Strategy",
      price: "$490",
      period: "",
      description: "A comprehensive roadmap to optimize your brand for the next generation of search.",
      features: [
        "Full Audit & Analysis",
        "Strategic Roadmap",
        "Optimization Guide",
        "1-on-1 Strategy Session"
      ],
      buttonText: "Get Strategy",
      action: () => openBooking("AI Visibility Strategy"),
      highlight: true
    },
    {
      name: "Strategy + Consulting",
      price: "$890",
      period: "",
      description: "Deep-dive consulting and hands-on implementation support for your brand.",
      features: [
        "Everything in Strategy",
        "Implementation Support",
        "Monthly Review Calls",
        "Priority Support"
      ],
      buttonText: "Get Strategy",
      action: () => openBooking("Strategy + Consulting"),
      highlight: false
    }
  ];

  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pt-40 md:pt-56 pb-32 px-6 relative z-10"
    >
      <div className="text-center mb-24">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] font-bold tracking-[0.2em] text-ink/40 uppercase mb-6 block"
        >
          Investment
        </motion.span>
        <h1 className="text-5xl md:text-7xl font-nixie mb-8 text-ink">
          Pricing plans
        </h1>
        <p className="text-xl text-ink/60 font-light max-w-xl mx-auto">Scale your AI visibility with precision and intelligence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group p-10 rounded-[2.5rem] border ${plan.highlight ? 'border-ink bg-ink text-white shadow-[0_40px_80px_rgba(0,0,0,0.15)]' : 'border-ink/5 bg-white'} transition-all duration-500 relative flex flex-col`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-ink text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-10">
              <h3 className={`text-[10px] uppercase tracking-[0.3em] font-bold ${plan.highlight ? 'text-white/40' : 'text-ink/40'} mb-4`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-nixie ${plan.highlight ? 'text-white' : 'text-ink'}`}>{plan.price}</span>
                <span className={`text-sm font-light ${plan.highlight ? 'text-white/40' : 'text-ink/40'}`}>{plan.period}</span>
              </div>
              <p className={`mt-6 text-sm font-light leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-ink/50'}`}>
                {plan.description}
              </p>
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
              {plan.features.map(feature => (
                <li key={feature} className={`flex items-center gap-4 text-sm font-light ${plan.highlight ? 'text-white/70' : 'text-ink/60'}`}>
                  <Hexagon size={8} outline className={plan.highlight ? 'text-white/20' : 'text-ink/20'} /> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={plan.action}
              className={`w-full py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                plan.highlight 
                ? 'bg-white text-ink hover:bg-white/90' 
                : 'border border-ink/10 text-ink hover:bg-surface-50'
              }`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
