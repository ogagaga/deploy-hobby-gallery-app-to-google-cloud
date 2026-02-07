"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createWork, updateWork } from "@/app/actions/work"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { TagAutoComplete } from "./tag-auto-complete"

interface WorkFormProps {
    initialData?: {
        id: string
        title: string
        kitName: string | null
        maker: string | null
        scale: string | null
        genre: string | null
        paints: string | null
        description: string | null
        mainImage: string
        tags: { name: string }[]
    }
}

export function WorkForm({ initialData }: WorkFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage || null)
    const [subImagesPreviews, setSubImagesPreviews] = useState<string[]>([])

    const isEdit = !!initialData

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        try {
            if (isEdit) {
                const result = await updateWork(initialData!.id, formData)
                if (result.success) {
                    toast.success("作品を更新しました")
                    router.push(`/works/${result.id}`)
                }
            } else {
                const result = await createWork(formData)
                if (result.success) {
                    toast.success("作品を投稿しました")
                    router.push("/")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error(`${isEdit ? "更新" : "投稿"}に失敗しました。`)
        } finally {
            setIsPending(false)
        }
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileList = Array.from(files)
            const newPreviews: string[] = []

            fileList.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string)
                    if (newPreviews.length === fileList.length) {
                        setSubImagesPreviews(prev => [...prev, ...newPreviews])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 左カラム: 画像アップロード */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="mainImage" className="text-lg font-bold">メイン写真 {!isEdit && <span className="text-destructive">*</span>}</Label>
                        <div
                            className="relative aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 transition-colors overflow-hidden group cursor-pointer"
                            onClick={() => document.getElementById('mainImage')?.click()}
                        >
                            {mainImagePreview ? (
                                <Image
                                    src={mainImagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                    <Upload className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="font-medium">クリックして画像を選択</p>
                                    <p className="text-xs opacity-60 mt-1">PNG, JPG, WebP (最大 10MB)</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <p className="font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    写真を変更
                                </p>
                            </div>
                        </div>
                        <Input
                            id="mainImage"
                            name="mainImage"
                            type="file"
                            accept="image/*"
                            required={!isEdit}
                            className="hidden"
                            onChange={handleMainImageChange}
                        />
                    </div>

                    {!isEdit && (
                        <div className="space-y-4">
                            <Label htmlFor="subImages" className="text-lg font-bold">サブ写真（複数選択可）</Label>
                            <Input
                                id="subImages"
                                name="subImages"
                                type="file"
                                accept="image/*"
                                multiple
                                className="cursor-pointer bg-muted/30 border-none h-auto py-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                onChange={handleSubImagesChange}
                            />

                            {subImagesPreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    {subImagesPreviews.map((preview, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group">
                                            <Image src={preview} alt="Sub preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold"
                                                onClick={() => setSubImagesPreviews(prev => prev.filter((_, i) => i !== idx))}
                                            >
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">完成後の各アングルや、制作工程などを追加できます。</p>
                        </div>
                    )}
                </div>

                {/* 右カラム: 基本情報 */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-bold">作品名 <span className="text-destructive">*</span></Label>
                        <Input id="title" name="title" placeholder="例: RX-78-2 ガンダム Ver.Ka" required defaultValue={initialData?.title} className="text-lg h-12" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="kitName" className="font-bold">キット名</Label>
                            <Input id="kitName" name="kitName" placeholder="MG 1/100 ガンダム" defaultValue={initialData?.kitName || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maker" className="font-bold">メーカー</Label>
                            <Input id="maker" name="maker" placeholder="BANDAISPIRITS" defaultValue={initialData?.maker || ""} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scale" className="font-bold">スケール</Label>
                            <Input id="scale" name="scale" placeholder="1/100" defaultValue={initialData?.scale || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genre" className="font-bold">ジャンル</Label>
                            <Input id="genre" name="genre" placeholder="キャラクターモデル" defaultValue={initialData?.genre || ""} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="font-bold">タグ（カンマ区切り）</Label>
                        <TagAutoComplete name="tags" defaultValue={initialData?.tags.map(t => t.name).join(", ") || ""} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paints" className="font-bold">使用塗料・マテリアル</Label>
                        <Textarea id="paints" name="paints" placeholder="ラッカー塗料、エナメル塗料など" rows={3} defaultValue={initialData?.paints || ""} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-bold">説明・制作ポイント</Label>
                <Textarea id="description" name="description" placeholder="こだわったポイントや、制作の感想などを自由に書いてください。" rows={6} defaultValue={initialData?.description || ""} className="resize-none" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" size="lg" className="rounded-full px-8" onClick={() => router.back()}>
                    キャンセル
                </Button>
                <Button type="submit" size="lg" disabled={isPending} className="rounded-full px-12 shadow-md">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {isEdit ? "更新中..." : "投稿中..."}
                        </>
                    ) : (
                        isEdit ? "作品を更新する" : "作品を投稿する"
                    )}
                </Button>
            </div>
        </form>
    )
}
