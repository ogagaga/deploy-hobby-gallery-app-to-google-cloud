"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-md"
            >
                {/* Visual Icon */}
                <div className="relative inline-block">
                    <div className="w-32 h-32 bg-muted/20 rounded-full flex items-center justify-center text-6xl mb-4">
                        📦
                    </div>
                    <motion.div
                        className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Search className="w-5 h-5" />
                    </motion.div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-foreground/80">
                        展示品が見つかりませんでした
                    </h2>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        お探しの作品は、まだ完成していないか、別の展示スペースへ移動した可能性があります。
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 gap-2 shadow-lg">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            ギャラリー入口へ戻る
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                        <Link href="/welcome">
                            サイトについて
                        </Link>
                    </Button>
                </div>

                <div className="pt-12">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-20">
                        Oga&apos;s Plastic Model Gallery Collection
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
