"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedBackdrop() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-80"
        animate={prefersReducedMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={prefersReducedMotion ? undefined : { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(16,185,129,0.12), rgba(56,189,248,0.1), rgba(165,180,252,0.14))",
          backgroundSize: "220% 220%"
        }}
      />
      <div className="absolute left-[-10%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.22),rgba(110,231,183,0))] blur-3xl animate-[floaty_14s_ease-in-out_infinite]" />
      <div className="absolute right-[-8%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),rgba(56,189,248,0))] blur-3xl animate-[floaty_18s_ease-in-out_infinite] [animation-delay:1.2s]" />
      <div className="absolute bottom-[-12%] left-[32%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16),rgba(251,191,36,0))] blur-3xl animate-[floaty_16s_ease-in-out_infinite] [animation-delay:2s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.3))]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:96px_96px]" />
    </div>
  );
}
