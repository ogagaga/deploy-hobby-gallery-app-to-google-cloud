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
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <Button asChild variant="ghost" className="hover:bg-transparent p-0 flex items-center gap-2 w-fit">
                    <Link href="/">
                        <ChevronLeft className="w-4 h-4" />
                        ギャラリー一覧に戻る
                    </Link>
                </Button>

                {isAdmin && (
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" className="rounded-full shadow-sm">
                            <Link href={`/works/${work.id}/edit`}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                編集
                            </Link>
                        </Button>
                        <DeleteButton workId={work.id} workTitle={work.title} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 左カラム: 画像セクション */}
                <div className="space-y-6">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border shadow-sm">
                        <Image
                            src={work.mainImage}
                            alt={work.title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {work.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {work.images.map((img: PrismaImage) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group cursor-pointer">
                                    <Image
                                        src={img.url}
                                        alt="サブ画像"
                                        fill
                                        className="object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 右カラム: 詳細情報セクション */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">{work.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {work.genre && <Badge variant="secondary">{work.genre}</Badge>}
                            {work.tags.map((tag: Tag) => (
                                <Badge key={tag.id} variant="outline">#{tag.name}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border">
                            <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">キット情報</p>
                                <p className="text-base">{work.kitName || "---"} {work.maker && <span className="text-muted-foreground">({work.maker})</span>}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border">
                            <Ruler className="w-5 h-5 text-cyan-500 mt-0.5" />
                            <div>
                                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">スケール</p>
                                <p className="text-base">{work.scale || "---"}</p>
                            </div>
                        </div>

                        {work.paints && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border">
                                <Palette className="w-5 h-5 text-pink-500 mt-0.5" />
                                <div>
                                    <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">使用塗料</p>
                                    <p className="text-base whitespace-pre-wrap">{work.paints}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            説明・ポイント
                        </h3>
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {work.description || "説明はありません。"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
