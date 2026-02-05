"use client"

import { motion, Variants, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

interface MotionContainerProps {
    children: ReactNode
    className?: string
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for premium feel
        }
    },
}

export function MotionContainer({ children, className }: MotionContainerProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={className}
        >
            <AnimatePresence mode="popLayout">
                {children}
            </AnimatePresence>
        </motion.div>
    )
}

export function MotionItem({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            layout
            className={className}
        >
            {children}
        </motion.div>
    )
}
