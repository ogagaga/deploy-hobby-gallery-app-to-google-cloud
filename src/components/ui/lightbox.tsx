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
    title?: string
    kitName?: string | null
}

export function Lightbox({ images, currentIndex, onClose, title, kitName }: LightboxProps) {
    const [index, setIndex] = useState<number | null>(currentIndex)

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
                    className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-md flex items-center justify-center select-none"
                    onClick={onClose}
                >
                    {/* Header Toolbar */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent z-[110]"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="flex flex-col">
                            <span className="text-white font-black tracking-tighter text-lg leading-none">
                                {title}
                            </span>
                            {kitName && (
                                <span className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">
                                    {kitName}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white/40 text-sm font-mono tracking-tighter tabular-nums">
                                {index + 1} / {images.length}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                aria-label="閉じる"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-16 h-16 z-[110] hidden sm:flex transition-transform hover:scale-110 active:scale-95"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        aria-label="前の画像へ"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-16 h-16 z-[110] hidden sm:flex transition-transform hover:scale-110 active:scale-95"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        aria-label="次の画像へ"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </Button>

                    {/* Main Image with Drag support */}
                    <motion.div
                        key={index}
                        layoutId={index === 0 ? "main-image" : `sub-image-${index - 1}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-full max-w-[95vw] max-h-[80vh] flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.8}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -100) handleNext()
                            else if (info.offset.x > 100) handlePrev()
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={images[index]}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Footer Progress & Indicators */}
                    <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-[110]">
                        <div className="flex gap-2">
                            {images.map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        width: i === index ? 32 : 8,
                                        backgroundColor: i === index ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)"
                                    }}
                                    className="h-1 rounded-full cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                                />
                            ))}
                        </div>

                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] sm:hidden">
                            Swipe to navigate
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
