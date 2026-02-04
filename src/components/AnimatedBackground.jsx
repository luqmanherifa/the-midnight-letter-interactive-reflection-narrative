import { motion } from "framer-motion";

export default function AnimatedBackground({ theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, rgba(41, 37, 36, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(214, 211, 209, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full ${
            isDark ? "bg-stone-400/70" : "bg-stone-500/70"
          }`}
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${(i * 8 + 10) % 90}%`,
            top: `${100 + (i % 3) * 10}%`,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [-80, -900],
            x: [0, (i % 2 === 0 ? 30 : -30) + (i % 3) * 8],
            opacity: [0, 0.9, 0.9, 0],
            scale: [0.8, 1.1, 1, 0.8],
          }}
          transition={{
            duration: 14 + (i % 4) * 2,
            repeat: Infinity,
            ease: "linear",
            delay: (i * 1.2) % 14,
          }}
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-small-${i}`}
          className={`absolute rounded-full ${
            isDark ? "bg-stone-300/60" : "bg-stone-600/60"
          }`}
          style={{
            width: "1.5px",
            height: "1.5px",
            left: `${(i * 12 + 15) % 85}%`,
            top: `${100 + (i % 2) * 15}%`,
            filter: "blur(0.3px)",
          }}
          animate={{
            y: [-60, -700],
            x: [0, i % 3 === 0 ? 15 : i % 3 === 1 ? -15 : 0],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 12 + (i % 3) * 2,
            repeat: Infinity,
            ease: "linear",
            delay: (i * 1.5) % 12,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 30%, rgba(12, 10, 9, 0.5) 100%)"
            : "radial-gradient(ellipse at center, transparent 30%, rgba(245, 245, 244, 0.5) 100%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
