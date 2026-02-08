"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons"
import { Camera, Menu, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import { ThemeToggle } from "./theme-toggle"
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion"

interface HeaderProps {
    session: Session | null
}

export function HeaderClient({ session }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isMenuOpen])

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-700 ease-in-out",
                    isScrolled
                        ? "h-12 glass shadow-2xl shadow-primary/5 border-b border-primary/5"
                        : "h-16 bg-transparent border-transparent"
                )}
            >
                {/* Scroll Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left z-50"
                    style={{ scaleX }}
                />

                <div className="container mx-auto h-full flex items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            layout
                            className={cn(
                                "rounded-xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-all duration-500 group-hover:rotate-6",
                                isScrolled ? "w-6 h-6" : "w-8 h-8"
                            )}
                        >
                            <Camera className={cn("transition-all duration-500", isScrolled ? "w-5 h-5" : "w-6 h-6")} />
                        </motion.div>
                        <span className={cn(
                            "font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent transition-all duration-700",
                            isScrolled ? "text-base" : "text-xl"
                        )}>
                            Hobby Gallery
                        </span>
                    </Link>
                    <div className="hidden md:flex ml-8 border-l pl-8 gap-6 text-sm font-bold text-muted-foreground/60">
                        <Link href="/welcome" className="hover:text-primary transition-colors">
                            ABOUT
                        </Link>
                        <Link href="/projects" className="hover:text-primary transition-colors">
                            シリーズ
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            {session ? (
                                <>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold leading-none">{session.user?.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-50">{session.user?.email}</span>
                                    </div>
                                    <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                                    <SignOutButton />
                                </>
                            ) : (
                                <SignInButton />
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-muted/20 hover:bg-muted/30 transition-colors z-50 relative"
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu - Moved outside header to avoid stacking context issues */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[90] md:hidden"
                        />
                        {/* Content */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-zinc-950 border-l shadow-2xl z-[100] md:hidden flex flex-col p-8 pt-24"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/30 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <nav className="flex flex-col gap-6">
                                <Link
                                    href="/"
                                    className="text-2xl font-black tracking-tighter hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/welcome"
                                    className="text-2xl font-black tracking-tighter hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ABOUT
                                </Link>
                                <Link
                                    href="/projects"
                                    className="text-2xl font-black tracking-tighter hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    シリーズ
                                </Link>
                                {session && (
                                    <Link
                                        href="/works/new"
                                        className="text-2xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Plus className="w-6 h-6" />
                                        作品を投稿
                                    </Link>
                                )}
                            </nav>

                            <div className="mt-auto pt-8 border-t space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">テーマ切り替え</span>
                                    <ThemeToggle />
                                </div>

                                {session ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black">{session.user?.name}</span>
                                            <span className="text-xs text-muted-foreground break-all">{session.user?.email}</span>
                                        </div>
                                        <SignOutButton />
                                    </div>
                                ) : (
                                    <div className="pt-4">
                                        <SignInButton />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
