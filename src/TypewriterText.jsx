import { motion } from "framer-motion";

export function TypewriterText({ text, delay = 0, speed = 0.03, onComplete }) {
  const totalDuration = delay + text.length * speed;

  return (
    <span style={{ display: "inline-block" }}>
      {text.split("").map((char, index) => {
        const isLastChar = index === text.length - 1;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.1,
              delay: delay + index * speed,
              ease: "easeIn",
            }}
            onAnimationComplete={() => {
              if (isLastChar && onComplete) {
                onComplete();
              }
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}
