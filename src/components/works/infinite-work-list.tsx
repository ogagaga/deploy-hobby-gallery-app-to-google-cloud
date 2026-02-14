"use client"

import { useState, useEffect, useMemo } from "react"
import { Work, Tag } from "@prisma/client"
import { WorkCard } from "./work-card"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { Badge } from "@/components/ui/badge"
import { useInView } from "react-intersection-observer"
import { getWorks } from "@/app/actions/work"

interface InfiniteWorkListProps {
    initialWorks: (Work & {
        tags: Tag[],
        images: { id: string }[],
        project: { name: string } | null
    })[]
    initialHasMore: boolean
    initialTotal: number
}

export function InfiniteWorkList({
    initialWorks,
    initialHasMore,
    // initialTotal is unused but kept in interface for now, removed from destructuring to silence lint warning
}: InfiniteWorkListProps) {
    // using initialTotal in useState if needed, or just ignore it.
    // The previous code had initialTotal in destructuring but not used.
    // Let's check if it's used in the function body. It wasn't.
    const [works, setWorks] = useState(initialWorks)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isLoading, setIsLoading] = useState(false)

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "200px",
    })

    // スクロール検知による追加読み込み
    useEffect(() => {
        async function loadMore() {
            if (isLoading || !hasMore || !inView || searchQuery || selectedGenre) return

            setIsLoading(true)
            const nextPage = page + 1
            const result = await getWorks(nextPage, 8)

            if (result.success) {
                setWorks(prev => [...prev, ...result.works])
                setPage(nextPage)
                setHasMore(result.hasMore)
            }
            setIsLoading(false)
        }

        if (inView && hasMore && !isLoading && !searchQuery && !selectedGenre) {
            loadMore()
        }
    }, [inView, hasMore, isLoading, searchQuery, selectedGenre, page]) // removed getWorks, added page

    const genres = useMemo(() => {
        const allGenres = works.map(w => w.genre).filter(Boolean) as string[]
        return Array.from(new Set(allGenres))
    }, [works])

    // クライアントサイドでのフィルタリング
    // 注意: 本来はサーバーサイドで行うべきだが、まずはUX維持のため現状のロジックを踏襲
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
        <div className="space-y-2">
            {/* フィルターセクション */}
            <div className="flex flex-col md:flex-row gap-2 items-end justify-between bg-white/40 dark:bg-zinc-900/40 p-2 rounded-xl glass border-none shadow-sm">
                <div className="w-full md:max-w-xs space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-0.5">Search</label>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="タイトル、タグ、キット名で検索..."
                            className="pl-9 h-10 rounded-lg bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-primary/20 transition-all text-sm shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 mr-0.5 text-right block md:hidden lg:block">ジャンル</label>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                        <Badge
                            variant={selectedGenre === null ? "default" : "outline"}
                            className="px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform font-bold text-[10px]"
                            onClick={() => setSelectedGenre(null)}
                        >
                            すべて
                        </Badge>
                        {genres.map(genre => (
                            <Badge
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                className="px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform font-bold text-[10px]"
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* リスト表示 */}
            {filteredWorks.length > 0 ? (
                <>
                    <MotionContainer className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
                        {filteredWorks.map((work) => (
                            <MotionItem key={work.id} className="break-inside-avoid">
                                <WorkCard work={work} />
                            </MotionItem>
                        ))}
                    </MotionContainer>

                    {/* 読み込みトリガー */}
                    {hasMore && !searchQuery && !selectedGenre && (
                        <div ref={ref} className="py-10 flex justify-center">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Loading more works...</p>
                                </div>
                            ) : (
                                <div className="h-1" /> // 無音のトリガー
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="py-24 text-center glass rounded-[3rem] border-dashed border-2 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center text-4xl mb-2">🔍</div>
                    <p className="text-2xl font-black tracking-tight">一致する作品が見つかりませんでした</p>
                    <p className="text-muted-foreground font-medium">検索条件を変えてみてください</p>
                </div>
            )}

            {/* 全件読み込み完了メッセージ */}
            {!hasMore && works.length > 0 && !searchQuery && !selectedGenre && (
                <div className="py-10 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-20">— End of Collection —</p>
                </div>
            )}
        </div>
    )
}
