"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className, delay = 0, y = 28, duration = 0.65 }: { children: ReactNode; className?: string; delay?: number; y?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className, delay = 0, stagger = 0.12 }: { children: ReactNode; className?: string; delay?: number; stagger?: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger
          }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.26, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Pressable({ children, className, ...props }: { children: ReactNode; className?: string } & MotionProps) {
  return (
    <motion.div className={className} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18, ease }} {...props}>
      {children}
    </motion.div>
  );
}

export function Floating({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 7, delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
