"use client"

import { motion } from "framer-motion"

interface ToolPageWrapperProps {
  children: React.ReactNode
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function ToolPageWrapper({ children }: ToolPageWrapperProps) {
  return (
    <motion.div
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={fadeInUp}>
        {children}
      </motion.div>
    </motion.div>
  )
} 