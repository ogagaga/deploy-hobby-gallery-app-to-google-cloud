"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createWork, updateWork } from "@/app/actions/work"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { TagAutoComplete } from "./tag-auto-complete"
import { compressImage } from "@/lib/image-compression"
import { MarkdownEditor } from "./markdown-editor"

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
        images: { id: string, url: string }[]
        projectId?: string | null
    }
    projects?: any[] // Project[] だが、簡易化のため any[]
}

import { Reorder } from "framer-motion"

type SubImage = {
    id?: string
    url: string
    file?: File
    isNew: boolean
    tempId: string
}

export function WorkForm({ initialData, projects = [] }: WorkFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage || null)

    // サブ画像を統合管理
    const [subImages, setSubImages] = useState<SubImage[]>(
        initialData?.images?.map(img => ({
            id: img.id,
            url: img.url,
            isNew: false,
            tempId: img.id
        })) || []
    )

    const [deleteImageUrls, setDeleteImageUrls] = useState<string[]>([])
    const [description, setDescription] = useState(initialData?.description || "")
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const isEdit = !!initialData

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)

        // 画像の順序・新規ファイル・削除情報を整理
        formData.delete("subImages")
        const orderInfo = subImages.map(img => {
            if (img.isNew && img.file) {
                formData.append("subImages", img.file)
                return { isNew: true, tempId: img.tempId }
            }
            return { id: img.id, isNew: false }
        })

        formData.append("imageOrder", JSON.stringify(orderInfo))

        // 削除対象のURLを追加
        deleteImageUrls.forEach(url => formData.append("deleteImageUrls", url))

        try {
            let result;
            if (isEdit) {
                result = await updateWork(initialData!.id, formData)
            } else {
                result = await createWork(formData)
            }

            if (result.success) {
                toast.success(isEdit ? "作品を更新しました" : "作品を投稿しました")
                if (isEdit && "id" in result) {
                    router.push(`/works/${result.id}`)
                } else {
                    router.push("/")
                }
            } else {
                // バリデーションエラーなどの個別エラー
                if (result.details) {
                    setErrors(result.details)
                    toast.error(result.error || "入力内容に不備があります。")
                } else {
                    toast.error(result.error || "失敗しました。")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("予期せぬエラーが発生しました。")
        } finally {
            setIsPending(false)
        }
    }

    // エラー表示用ヘルパー
    const ErrorMessage = ({ field }: { field: string }) => {
        if (!errors[field]) return null
        return (
            <p className="text-sm font-medium text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
                {errors[field][0]}
            </p>
        )
    }

    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const compressionToastId = toast.loading("画像を最適化中...")
            try {
                const compressedFile = await compressImage(file)
                toast.dismiss(compressionToastId)

                const reader = new FileReader()
                reader.onloadend = () => {
                    setMainImagePreview(reader.result as string)
                }
                reader.readAsDataURL(compressedFile)
            } catch (err) {
                toast.error("画像の圧縮に失敗しました", { id: compressionToastId })
            }
        }
    }

    const handleSubImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileList = Array.from(files)
            const compressionToastId = toast.loading(`${fileList.length}枚の画像を最適化中...`)

            try {
                for (const file of fileList) {
                    const compressedFile = await compressImage(file)
                    const reader = new FileReader()
                    const tempId = Math.random().toString(36).substring(7)

                    await new Promise<void>((resolve) => {
                        reader.onloadend = () => {
                            setSubImages(prev => [...prev, {
                                url: reader.result as string,
                                file: compressedFile,
                                isNew: true,
                                tempId: tempId
                            }])
                            resolve()
                        }
                        reader.readAsDataURL(compressedFile)
                    })
                }
                toast.success("画像の最適化が完了しました", { id: compressionToastId })
            } catch (err) {
                toast.error("一部の画像で圧縮に失敗しました", { id: compressionToastId })
            }
            e.target.value = ""
        }
    }

    const removeSubImage = (tempId: string, url: string, isNew: boolean) => {
        setSubImages(prev => prev.filter(img => img.tempId !== tempId))
        if (!isNew) {
            setDeleteImageUrls(prev => [...prev, url])
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
                            className={`relative aspect-square rounded-2xl border-2 border-dashed transition-colors overflow-hidden group cursor-pointer ${errors.mainImage ? "border-destructive/50 bg-destructive/5" : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10"
                                }`}
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
                                    <p className="text-xs opacity-60 mt-1">PNG, JPG, WebP (最大 5MB)</p>
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
                        <ErrorMessage field="mainImage" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-bold">サブ写真</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => document.getElementById('subImages')?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    追加
                                </Button>
                                <input
                                    id="subImages"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleSubImagesChange}
                                />
                            </div>

                            <Reorder.Group
                                axis="y"
                                values={subImages}
                                onReorder={setSubImages}
                                className="space-y-3"
                            >
                                {subImages.map((img) => (
                                    <Reorder.Item
                                        key={img.tempId}
                                        value={img}
                                        className="relative flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-muted-foreground/10 group cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div className="relative w-20 aspect-square rounded-xl overflow-hidden shrink-0 border border-muted-foreground/10 bg-black">
                                            <Image
                                                src={img.url}
                                                alt="Sub preview"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                                                {img.isNew ? "新規アップロード" : "公開済み"}
                                            </p>
                                            <p className="text-sm font-medium truncate opacity-60">
                                                {img.tempId.substring(0, 8)}...
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSubImage(img.tempId, img.url, img.isNew);
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>

                                        {/* Drag Handle Icon Indicator */}
                                        <div className="text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors px-2">
                                            <div className="grid grid-cols-2 gap-0.5">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="w-1 h-1 rounded-full bg-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            {subImages.length === 0 && (
                                <div className="py-12 border-2 border-dashed border-muted-foreground/10 rounded-2xl flex flex-col items-center justify-center text-muted-foreground/40">
                                    <Upload className="w-8 h-8 mb-2 opacity-10" />
                                    <p className="text-xs font-medium uppercase tracking-widest">サブ写真なし</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">完成後の各アングルや、制作工程などを追加できます。</p>
                    </div>
                </div>

                {/* 右カラム: 基本情報 */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-bold">作品名 <span className="text-destructive">*</span></Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="例: RX-78-2 ガンダム Ver.Ka"
                            defaultValue={initialData?.title}
                            className={`text-lg h-12 ${errors.title ? "border-destructive ring-destructive/20" : ""}`}
                        />
                        <ErrorMessage field="title" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="kitName" className="font-bold">キット名</Label>
                            <Input id="kitName" name="kitName" placeholder="MG 1/100 ガンダム" defaultValue={initialData?.kitName || ""} />
                            <ErrorMessage field="kitName" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maker" className="font-bold">メーカー</Label>
                            <Input id="maker" name="maker" placeholder="BANDAISPIRITS" defaultValue={initialData?.maker || ""} />
                            <ErrorMessage field="maker" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scale" className="font-bold">スケール</Label>
                            <Input id="scale" name="scale" placeholder="1/100" defaultValue={initialData?.scale || ""} />
                            <ErrorMessage field="scale" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genre" className="font-bold">ジャンル</Label>
                            <Input id="genre" name="genre" placeholder="キャラクターモデル" defaultValue={initialData?.genre || ""} />
                            <ErrorMessage field="genre" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectId" className="font-bold text-primary">所属プロジェクト（シリーズ）</Label>
                        <select
                            id="projectId"
                            name="projectId"
                            defaultValue={initialData?.projectId || ""}
                            className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus:border-primary"
                        >
                            <option value="">なし（単独作品）</option>
                            {projects.map((project: any) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground ml-1">※プロジェクトを選択すると、関連作品としてまとめられます。</p>
                        <ErrorMessage field="projectId" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="font-bold">タグ（カンマ区切り）</Label>
                        <TagAutoComplete name="tags" defaultValue={initialData?.tags.map(t => t.name).join(", ") || ""} />
                        <ErrorMessage field="tags" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paints" className="font-bold">使用塗料・マテリアル</Label>
                        <Textarea id="paints" name="paints" placeholder="ラッカー塗料、エナメル塗料など" rows={3} defaultValue={initialData?.paints || ""} />
                        <ErrorMessage field="paints" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label htmlFor="description" className="text-lg font-bold">説明・制作ポイント</Label>
                <MarkdownEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="こだわったポイントや、制作の感想などを自由に書いてください。"
                />
                <input type="hidden" name="description" value={description} />
                <ErrorMessage field="description" />
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
