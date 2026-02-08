"use client"

import { OptimizedImage } from "@/components/ui/optimized-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Package, Ruler, Palette, Edit3, Heart } from "lucide-react"
import Link from "next/link"
import { Image as PrismaImage, Tag, Work } from "@prisma/client"
import { DeleteButton } from "@/components/works/delete-button"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { useState, useMemo } from "react"
import { Lightbox } from "@/components/ui/lightbox"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { useImageColors } from "@/hooks/use-image-colors"

interface WorkDetailClientProps {
    work: Work & {
        images: PrismaImage[]
        tags: Tag[]
    }
    isAdmin: boolean
}

export function WorkDetailClient({ work, isAdmin }: WorkDetailClientProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const { colors } = useImageColors(work.mainImage)

    const allImages = useMemo(() => [work.mainImage, ...work.images.map(img => img.url)], [work])

    // CSSカスタムプロパティのスタイルオブジェクトを作成
    const dynamicStyles = {
        "--vibrant": colors.vibrant || "var(--primary)",
        "--light-vibrant": colors.lightVibrant || colors.vibrant || "var(--primary)",
        "--dark-vibrant": colors.darkVibrant || "var(--primary)",
        "--muted": colors.muted || "var(--muted-foreground)",
        "--light-muted": colors.lightMuted || "var(--muted)",
        "--dark-muted": colors.darkMuted || "var(--muted-foreground)",
    } as React.CSSProperties

    return (
        <MotionContainer
            className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative"
            style={dynamicStyles}
        >
            {/* Dynamic Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 dark:opacity-10 transition-colors duration-1000"
                    style={{ backgroundColor: "var(--light-vibrant)" }}
                />
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-15 dark:opacity-10 transition-colors duration-1000"
                    style={{ backgroundColor: "var(--vibrant)" }}
                />
            </div>
            <MotionItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Button asChild variant="ghost" className="hover:bg-accent/50 p-0 pr-4 flex items-center gap-2 w-fit rounded-full transition-all">
                    <Link href="/">
                        <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shadow-sm">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">ギャラリー一覧に戻る</span>
                    </Link>
                </Button>

                {isAdmin && (
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all px-6">
                            <Link href={`/works/${work.id}/edit`}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                編集
                            </Link>
                        </Button>
                        <DeleteButton workId={work.id} workTitle={work.title} />
                    </div>
                )}
            </MotionItem>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 左カラム: 画像セクション (7/12) */}
                <div className="lg:col-span-7 space-y-6">
                    <MotionItem
                        layoutId="main-image"
                        className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900 border shadow-2xl shadow-zinc-200/50 dark:shadow-none ring-1 ring-zinc-200/50 dark:ring-zinc-800 cursor-zoom-in"
                    >
                        <OptimizedImage
                            src={work.mainImage}
                            alt={work.title}
                            fill
                            className="object-contain p-4"
                            priority
                            containerClassName="w-full h-full"
                            onClick={() => setLightboxIndex(0)}
                        />
                    </MotionItem>

                    {work.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {work.images.map((img: PrismaImage, idx: number) => (
                                <MotionItem
                                    key={img.id}
                                    layoutId={`sub-image-${idx}`}
                                    className="relative aspect-square rounded-3xl overflow-hidden border bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800 group cursor-zoom-in shadow-sm hover:shadow-md transition-all"
                                >
                                    <OptimizedImage
                                        src={img.url}
                                        alt="サブ画像"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        containerClassName="w-full h-full"
                                        onClick={() => setLightboxIndex(idx + 1)}
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </MotionItem>
                            ))}
                        </div>
                    )}
                </div>

                {/* 右カラム: 詳細情報セクション (5/12) */}
                <div className="lg:col-span-5 space-y-6">
                    <MotionItem className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black tracking-tight text-foreground leading-[1.1] tracking-tighter">
                                {work.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {work.genre && (
                                <Badge
                                    className="rounded-full border-none px-4 py-1 text-xs font-black uppercase tracking-widest shadow-lg shadow-[var(--vibrant)]/20 transition-colors duration-500"
                                    style={{
                                        backgroundColor: "var(--vibrant)",
                                        color: "white" // 常に白文字でコントラスト確保
                                    }}
                                >
                                    {work.genre}
                                </Badge>
                            )}
                            {work.tags.map((tag: Tag) => (
                                <Badge key={tag.id} variant="outline" className="rounded-full px-4 py-1 text-xs font-medium border-zinc-200 dark:border-zinc-800 text-muted-foreground">
                                    #{tag.name}
                                </Badge>
                            ))}
                        </div>
                    </MotionItem>

                    <MotionItem className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-4 p-3 rounded-[1.5rem] bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--light-vibrant)]/5">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500"
                                style={{ backgroundColor: "var(--light-vibrant)", opacity: 0.8, color: "white" }}
                            >
                                <Package className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">KIT INFO</p>
                                <p className="text-lg font-bold truncate">
                                    {work.kitName || "---"}
                                    {work.maker && <span className="ml-2 text-muted-foreground font-medium text-base">({work.maker})</span>}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-[1.5rem] bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--vibrant)]/5">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500"
                                style={{ backgroundColor: "var(--vibrant)", color: "white" }}
                            >
                                <Ruler className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">SCALE</p>
                                <p className="text-lg font-bold">{work.scale || "---"}</p>
                            </div>
                        </div>

                        {work.paints && (
                            <div className="flex items-start gap-4 p-3 rounded-[1.5rem] bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--muted)]/5">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500"
                                    style={{ backgroundColor: "var(--muted)", color: "white" }}
                                >
                                    <Palette className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">PAINTS</p>
                                    <p className="text-base font-medium whitespace-pre-wrap leading-relaxed">{work.paints}</p>
                                </div>
                            </div>
                        )}
                    </MotionItem>

                    <MotionItem className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-1.5 h-8 rounded-full shadow-lg transition-colors duration-500"
                                style={{
                                    backgroundColor: "var(--vibrant)",
                                    boxShadow: "0 0 20px var(--vibrant)"
                                }}
                            />
                            <h3 className="text-2xl font-black tracking-tight tracking-tighter">DESIGN NOTES</h3>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800" />
                            <MarkdownRenderer
                                content={work.description || "説明はありません。"}
                                className="text-xl leading-relaxed"
                            />
                        </div>
                    </MotionItem>
                </div>
            </div>

            <Lightbox
                images={allImages}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                title={work.title}
                kitName={work.kitName}
            />
        </MotionContainer>
    )
}
