"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PageTransitionProps {
    children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1], // 高級感のあるイージング (Cubic Bezier)
            }}
        >
            {children}
        </motion.div>
    )
}
