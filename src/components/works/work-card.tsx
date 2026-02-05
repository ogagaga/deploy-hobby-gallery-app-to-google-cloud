"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

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
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Link href={`/works/${work.id}`} className="block group">
                <Card className="overflow-hidden border-none shadow-sm premium-shadow-hover rounded-3xl bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5 hover:ring-primary/20">
                    <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={work.mainImage}
                                alt={work.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                <p className="text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    詳細を見る →
                                </p>
                            </div>
                            {work.genre && (
                                <Badge className="absolute top-4 left-4 rounded-full bg-white/90 dark:bg-zinc-900/90 text-foreground border-none backdrop-blur-md shadow-sm">
                                    {work.genre}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {work.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary/40" />
                            {work.kitName || "No Kit Name"}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {work.tags.slice(0, 3).map((tag) => (
                                <span key={tag.name} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}
