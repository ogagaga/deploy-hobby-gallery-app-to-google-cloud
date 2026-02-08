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
        tags: { name: string }[]
        project?: { name: string } | null
    }
}

export function WorkCard({ work }: WorkCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/works/${work.id}`} className="block group">
                <Card className="relative overflow-hidden border-none shadow-sm premium-shadow-hover rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5 hover:ring-primary/20 transition-all duration-500">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%]"
                            variants={{
                                hover: {
                                    translateX: ["200%"],
                                }
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                        />
                    </div>

                    <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100/50 dark:bg-zinc-900/50">
                            <OptimizedImage
                                src={work.mainImage}
                                alt={work.title}
                                fill
                                className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                                containerClassName="w-full h-full"
                            />
                            {/* Badges Overlay */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {work.genre && (
                                    <Badge variant="secondary" className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-none shadow-sm font-bold rounded-full px-3 text-[10px] uppercase">
                                        {work.genre}
                                    </Badge>
                                )}
                                {work.project && (
                                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-none shadow-lg font-black rounded-full px-3 text-[10px] uppercase tracking-tighter">
                                        Series: {work.project.name}
                                    </Badge>
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end p-4">
                                <motion.p
                                    className="text-white text-[10px] font-bold tracking-tight"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    VIEW DETAILS <span className="ml-2">→</span>
                                </motion.p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3">
                        <div className="space-y-2">
                            <div className="space-y-0.5">
                                <CardTitle className="text-sm font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                    {work.title}
                                </CardTitle>
                                {work.kitName && (
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 font-medium italic opacity-80">
                                        {work.kitName} {work.maker && `— ${work.maker}`}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {work.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="text-[9px] font-bold text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                                        {tag.name}
                                    </span>
                                ))}
                                {work.tags.length > 2 && (
                                    <span className="text-[9px] font-bold text-muted-foreground/40 px-1.5 py-0.5 uppercase tracking-widest">
                                        +{work.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div >
    )
}
