"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
    session: Session | null
}

export function HeaderClient({ session }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-500",
                isScrolled
                    ? "h-16 glass shadow-lg border-b-primary/5"
                    : "h-20 bg-transparent border-transparent"
            )}
        >
            <div className="container mx-auto h-full flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className={cn(
                        "rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        isScrolled ? "w-8 h-8" : "w-10 h-10"
                    )}>
                        <Camera className={cn("transition-all", isScrolled ? "w-5 h-5" : "w-6 h-6")} />
                    </div>
                    <span className={cn(
                        "font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-500",
                        isScrolled ? "text-xl" : "text-2xl"
                    )}>
                        Hobby Gallery
                    </span>
                </Link>
                <div className="hidden md:flex ml-8 border-l pl-8 gap-6 text-sm font-bold text-muted-foreground/60">
                    <Link href="/welcome" className="hover:text-primary transition-colors">
                        ABOUT
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold leading-none">{session.user?.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-50">{session.user?.email}</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
                            <SignOutButton />
                        </div>
                    ) : (
                        <SignInButton />
                    )}
                </div>
            </div>
        </header>
    )
}
