"use client"

import { motion } from "motion/react"

const words = [
  { text: "Break.", className: "text-[#C9A96A]" },
  { text: "Build.", className: "text-[#B8935A]" },
  { text: "Become.", className: "text-[#EDE0C8]" },
]

export function IntroHeader() {
  return (
    <div className="mb-16 text-center">
      <h1 className="mb-6 flex flex-wrap justify-center gap-x-4 text-5xl font-bold font-display tracking-tight sm:text-6xl">
        {words.map((word, index) => (
          <motion.span
            key={word.text}
            className={word.className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
          >
            {word.text}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className="mx-auto max-w-3xl text-lg font-semibold text-muted-foreground"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
      >
        Welcome to STRENTOR — your catalyst for total transformation. We blend physical power, mental strength, and personal growth to help you become <strong className="text-foreground">UNSTOPPABLE</strong>.
      </motion.p>
    </div>
  )
}
