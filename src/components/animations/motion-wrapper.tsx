"use client"

import { motion, HTMLMotionProps, Variants } from "framer-motion"
import { ReactNode } from "react"

interface MotionProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

export function MotionContainer({ children, className, ...props }: MotionProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function MotionItem({ children, className, ...props }: MotionProps) {
    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            exit="hidden"
            layout
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
