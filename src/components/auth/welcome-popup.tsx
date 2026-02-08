"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

interface WelcomePopupProps {
    userName: string | null | undefined
}

export function WelcomePopup({ userName }: WelcomePopupProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // セッションストレージを確認
        const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome")

        if (!hasSeenWelcome && userName) {
            // 少し遅らせて表示（UX向上）
            const timer = setTimeout(() => {
                setIsOpen(true)
                sessionStorage.setItem("hasSeenWelcome", "true")
            }, 800)

            return () => clearTimeout(timer)
        }
    }, [userName])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-3xl font-black tracking-tight tracking-tighter">
                            おかえりなさい！
                        </DialogTitle>
                        <DialogDescription className="text-xl font-bold text-foreground">
                            {userName || "モデラー"} さん
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-8 space-y-4 text-muted-foreground font-medium leading-relaxed">
                        <p>
                            Oga&apos;s Plastic Model Galleryへようこそ。今日も素晴らしい制作記録を、あなたのギャラリーに加えましょう。
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
