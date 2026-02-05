import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Package, Ruler, Palette, Edit3 } from "lucide-react"
import { Image as PrismaImage, Tag } from "@prisma/client"
import { auth } from "@/auth"
import { DeleteButton } from "@/components/works/delete-button"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"

interface WorkDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
    const session = await auth()
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const { id } = await params

    const work = await prisma.work.findUnique({
        where: { id },
        include: {
            images: true,
            tags: true,
        },
    })

    if (!work) {
        notFound()
    }

    return (
        <MotionContainer className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <MotionItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* 左カラム: 画像セクション (7/12) */}
                <MotionItem className="lg:col-span-7 space-y-8">
                    <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900 border shadow-2xl shadow-zinc-200/50 dark:shadow-none ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                        <Image
                            src={work.mainImage}
                            alt={work.title}
                            fill
                            className="object-contain p-4"
                            priority
                        />
                    </div>

                    {work.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-6">
                            {work.images.map((img: PrismaImage) => (
                                <MotionItem key={img.id} className="relative aspect-square rounded-3xl overflow-hidden border bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800 group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                    <Image
                                        src={img.url}
                                        alt="サブ画像"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </MotionItem>
                            ))}
                        </div>
                    )}
                </MotionItem>

                {/* 右カラム: 詳細情報セクション (5/12) */}
                <div className="lg:col-span-5 space-y-12">
                    <MotionItem className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black tracking-tight text-foreground leading-[1.1] tracking-tighter">
                                {work.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {work.genre && (
                                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-xs font-bold uppercase tracking-wider">
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

                    <MotionItem className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">KIT INFO</p>
                                <p className="text-lg font-bold">
                                    {work.kitName || "---"}
                                    {work.maker && <span className="ml-2 text-muted-foreground font-medium text-base">({work.maker})</span>}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                <Ruler className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">SCALE</p>
                                <p className="text-lg font-bold">{work.scale || "---"}</p>
                            </div>
                        </div>

                        {work.paints && (
                            <div className="flex items-start gap-5 p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                                    <Palette className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-muted-foreground uppercase text-[10px] tracking-widest mb-1 opacity-60">PAINTS</p>
                                    <p className="text-base font-medium whitespace-pre-wrap leading-relaxed">{work.paints}</p>
                                </div>
                            </div>
                        )}
                    </MotionItem>

                    <MotionItem className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                            <h3 className="text-2xl font-black tracking-tight tracking-tighter">DESIGN NOTES</h3>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800" />
                            <p className="text-xl leading-relaxed whitespace-pre-wrap text-muted-foreground font-medium">
                                {work.description || "説明はありません。"}
                            </p>
                        </div>
                    </MotionItem>
                </div>
            </div>
        </MotionContainer>
    )
}
