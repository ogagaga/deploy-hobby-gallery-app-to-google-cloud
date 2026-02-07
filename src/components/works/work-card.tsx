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
    }
}

export function WorkCard({ work }: WorkCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/works/${work.id}`} className="block group">
                <Card className="relative overflow-hidden border-none shadow-sm premium-shadow-hover rounded-3xl bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5 hover:ring-primary/20 transition-all duration-500">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-3xl">
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
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <OptimizedImage
                                src={work.mainImage}
                                alt={work.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                containerClassName="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-end p-8">
                                <motion.p
                                    className="text-white text-sm font-bold tracking-tight"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    VIEW DETAILS <span className="ml-2">→</span>
                                </motion.p>
                            </div>
                            {work.genre && (
                                <Badge className="absolute top-4 left-4 z-20 rounded-full bg-white/95 dark:bg-zinc-900/95 text-foreground border-none backdrop-blur-xl shadow-md px-4 py-1 text-[10px] font-bold tracking-wider uppercase">
                                    {work.genre}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                    {work.title}
                                </CardTitle>
                                {work.kitName && (
                                    <p className="text-sm text-muted-foreground line-clamp-1 font-medium italic opacity-80">
                                        {work.kitName} {work.maker && `— ${work.maker}`}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {work.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                        {tag.name}
                                    </span>
                                ))}
                                {work.tags.length > 3 && (
                                    <span className="text-[10px] font-bold text-muted-foreground/40 px-2 py-0.5 uppercase tracking-widest">
                                        +{work.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}
