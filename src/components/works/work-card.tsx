"use client"

import { OptimizedImage } from "@/components/ui/optimized-image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkCardProps {
    work: {
        id: string
        title: string
        kitName: string | null
        maker: string | null
        genre: string | null
        mainImage: string
        description?: string | null
        images?: { id: string }[]
        tags: { name: string }[]
        project?: { name: string } | null
    }
}

export function WorkCard({ work }: WorkCardProps) {
    const imageCount = (work.images?.length || 0) + 1; // メイン画像 + サブ画像

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/works/${work.id}`} className="block group">
                <Card className="relative overflow-hidden border-none shadow-none bg-transparent transition-all duration-500">
                    <CardHeader className="p-0 mb-3">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                            <OptimizedImage
                                src={work.mainImage}
                                alt={work.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                containerClassName="w-full h-full"
                            />

                            {/* Photo Count Badge (Sample Inspired) */}
                            <div className="absolute top-3 right-3 z-20">
                                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white shadow-xl">
                                    <span className="text-[11px] font-black tracking-tighter opacity-90">{imageCount}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <path d="M7 7h10M7 12h10M7 17h10" />
                                    </svg>
                                </div>
                            </div>

                            {/* Genre Badge overlay */}
                            {work.genre && (
                                <div className="absolute bottom-3 left-3 z-20">
                                    <Badge variant="secondary" className="bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md border-none shadow-sm font-bold rounded-full px-3 text-[10px] uppercase">
                                        {work.genre}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                {work.title}
                            </h3>
                            {work.description ? (
                                <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed opacity-90">
                                    {work.description}
                                </p>
                            ) : (
                                work.kitName && (
                                    <p className="text-sm text-muted-foreground line-clamp-1 font-medium italic opacity-70">
                                        {work.kitName} {work.maker && `— ${work.maker}`}
                                    </p>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div >
    )
}
