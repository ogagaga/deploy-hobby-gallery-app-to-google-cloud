"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface LightboxProps {
    images: string[]
    currentIndex: number | null
    onClose: () => void
}

export function Lightbox({ images, currentIndex, onClose }: LightboxProps) {
    const [index, setIndex] = useState(currentIndex)

    useEffect(() => {
        setIndex(currentIndex)
    }, [currentIndex])

    const handleNext = useCallback(() => {
        if (index === null) return
        setIndex((index + 1) % images.length)
    }, [index, images.length])

    const handlePrev = useCallback(() => {
        if (index === null) return
        setIndex((index - 1 + images.length) % images.length)
    }, [index, images.length])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "ArrowLeft") handlePrev()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose, handleNext, handlePrev])

    return (
        <AnimatePresence>
            {index !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center select-none"
                    onClick={onClose}
                >
                    <motion.div
                        className="absolute top-6 right-6 flex items-center gap-4 z-[110]"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <span className="text-white/40 text-sm font-mono tracking-tighter">
                            {index + 1} / {images.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </motion.div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-16 h-16 z-[110] hidden sm:flex"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-16 h-16 z-[110] hidden sm:flex"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    >
                        <ChevronRight className="w-10 h-10" />
                    </Button>

                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={images[index]}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* スマホ用スワイプエリア的な演出 */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 sm:hidden z-[110]">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-4' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
