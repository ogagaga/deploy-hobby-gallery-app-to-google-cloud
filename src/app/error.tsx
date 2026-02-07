"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Home, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // エラーをログに記録（必要に応じて）
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-md"
            >
                {/* Visual Icon */}
                <div className="relative inline-block">
                    <div className="w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center text-6xl mb-4">
                        🛠️
                    </div>
                    <motion.div
                        className="absolute -top-2 -right-2 bg-destructive text-white p-2 rounded-full shadow-lg"
                        animate={{
                            rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: 5,
                            ease: "easeInOut"
                        }}
                    >
                        <AlertTriangle className="w-5 h-5" />
                    </motion.div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                        搬入中にトラブルが発生しました
                    </h2>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        作品の表示中に予期せぬエラーが発生しました。パーツの再確認（再読み込み）をお試しください。
                    </p>
                </div>

                {error.digest && (
                    <div className="p-3 bg-muted/50 rounded-xl">
                        <p className="text-[10px] font-mono text-muted-foreground break-all">
                            Error ID: {error.digest}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        className="rounded-full px-8 gap-2 shadow-lg"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        再試行する
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            TOPページへ
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
