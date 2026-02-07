"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject, updateProject } from "@/app/actions/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Rocket, LayoutGrid, Save, ImageUp } from "lucide-react"
import { toast } from "sonner"

interface ProjectFormProps {
    initialData?: {
        id: string
        name: string
        description: string | null
        mainImage: string | null
    }
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.mainImage || null)
    const isEdit = !!initialData

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        setErrors({})

        try {
            const result = isEdit
                ? await updateProject(initialData.id, formData)
                : await createProject(formData)

            if (result.success) {
                toast.success(isEdit ? "プロジェクトを更新しました" : "プロジェクトを作成しました")
                router.push(`/projects/${result.id}`)
            } else {
                if (result.details) {
                    setErrors(result.details)
                }
                toast.error(result.error || "作成に失敗しました")
            }
        } catch (error) {
            toast.error("システムエラーが発生しました")
        } finally {
            setIsPending(false)
        }
    }

    const ErrorMessage = ({ field }: { field: string }) => {
        if (!errors[field]) return null
        return (
            <p className="text-sm font-bold text-destructive mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors[field][0]}
            </p>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5">
                <CardContent className="p-10 space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-lg font-bold">プロジェクト名</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={initialData?.name}
                            placeholder="例: 一年戦争 MG コレクション"
                            className="h-14 rounded-2xl text-xl font-bold"
                        />
                        <ErrorMessage field="name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-lg font-bold">プロジェクトの説明</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description || ""}
                            placeholder="このシリーズのコンセプトや目標について..."
                            className="min-h-[150px] rounded-[2rem] p-6 text-lg leading-relaxed"
                        />
                        <ErrorMessage field="description" />
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="mainImage" className="text-lg font-bold">カバー画像</Label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-48 aspect-square rounded-3xl bg-muted overflow-hidden relative group">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-center flex-col items-center justify-center text-muted-foreground">
                                        <ImageUp className="w-10 h-10 mb-2 opacity-20" />
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <Input
                                    id="mainImage"
                                    name="mainImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="h-14 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                                <ErrorMessage field="mainImage" />
                                <p className="text-xs text-muted-foreground ml-1 font-medium">
                                    推奨サイズ: 1200x900px (4:3) / 最大 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-16 rounded-full text-lg font-bold"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2] h-16 rounded-full text-lg font-bold shadow-xl shadow-primary/20"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {isEdit ? <Save className="w-6 h-6 mr-2" /> : <Rocket className="w-6 h-6 mr-2" />}
                                    {isEdit ? "更新する" : "作成する"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
