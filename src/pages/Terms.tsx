import React from "react";
import { motion } from "motion/react";

export const Terms = () => {
  return (
    <motion.div
      key="terms"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto pt-40 md:pt-56 pb-32 px-6 relative z-10"
    >
      <div className="mb-24">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] font-bold tracking-[0.2em] text-ink/40 uppercase mb-6 block"
        >
          Legal / Documentation
        </motion.span>
        <h1 className="text-5xl md:text-7xl font-nixie mb-8 text-ink">Terms of Service</h1>
        <p className="text-sm text-ink/40 font-mono tracking-widest uppercase">Last Updated: February 23, 2026</p>
      </div>

      <div className="space-y-20 text-ink/70 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">1. Acceptance of Terms</h2>
          <p className="text-lg">By accessing or using the Be-visible platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We provide a platform for AI visibility analysis and optimization.</p>
        </section>

        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">2. Use of Service</h2>
          <p className="text-lg">You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">3. Intellectual Property</h2>
          <p className="text-lg">The service and its original content, features, and functionality are and will remain the exclusive property of Be-visible and its licensors. Our platform uses proprietary algorithms to analyze AI model responses and provide visibility metrics.</p>
        </section>

        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">4. Data and Privacy</h2>
          <p className="text-lg">Your use of the service is also governed by our Privacy Policy. We collect and process data as necessary to provide our AI visibility services. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">5. Limitation of Liability</h2>
          <p className="text-lg">In no event shall Be-visible be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-nixie text-ink mb-6">6. Changes to Terms</h2>
          <p className="text-lg">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.</p>
        </section>
      </div>
    </motion.div>
  );
};
