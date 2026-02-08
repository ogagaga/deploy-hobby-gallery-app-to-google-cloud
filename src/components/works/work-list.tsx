"use client"

import { useState, useMemo } from "react"
import { Work, Tag } from "@prisma/client"
import { WorkCard } from "./work-card"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { Badge } from "@/components/ui/badge"

interface WorkListProps {
    works: (Work & { tags: Tag[] })[]
}

export function WorkList({ works }: WorkListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

    const genres = useMemo(() => {
        const allGenres = works.map(w => w.genre).filter(Boolean) as string[]
        return Array.from(new Set(allGenres))
    }, [works])

    const filteredWorks = useMemo(() => {
        return works.filter(work => {
            const matchesSearch =
                work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                work.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                work.kitName?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesGenre = selectedGenre ? work.genre === selectedGenre : true

            return matchesSearch && matchesGenre
        })
    }, [works, searchQuery, selectedGenre])

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between bg-white/40 dark:bg-zinc-900/40 p-8 rounded-[2.5rem] glass border-none shadow-sm">
                <div className="w-full md:max-w-md space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Search</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="タイトル、タグ、キット名で検索..."
                            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-primary/20 transition-all text-base shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1 text-right block md:hidden lg:block">Filter by Genre</label>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Badge
                            variant={selectedGenre === null ? "default" : "outline"}
                            className="px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform font-bold"
                            onClick={() => setSelectedGenre(null)}
                        >
                            すべて
                        </Badge>
                        {genres.map(genre => (
                            <Badge
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                className="px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform font-bold"
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {filteredWorks.length > 0 ? (
                <MotionContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredWorks.map((work) => (
                        <MotionItem key={work.id}>
                            <WorkCard work={work} />
                        </MotionItem>
                    ))}
                </MotionContainer>
            ) : (
                <div className="py-24 text-center glass rounded-[3rem] border-dashed border-2 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center text-4xl mb-2">🔍</div>
                    <p className="text-2xl font-black tracking-tight">一致する作品が見つかりませんでした</p>
                    <p className="text-muted-foreground font-medium">検索条件を変えてみてください</p>
                </div>
            )}
        </div>
    )
}
