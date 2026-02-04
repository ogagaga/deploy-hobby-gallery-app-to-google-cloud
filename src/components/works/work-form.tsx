"use client"

import { useState } from "react"
import { createWork } from "@/app/actions/work"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WorkForm() {
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        try {
            await createWork(formData)
            // 成功時は actions 側で redirect("/") が呼ばれるため、ここには到達しない（Next.jsの仕様）
        } catch (error) {
            const err = error as Error
            // Next.js の redirect は内部的にエラーを投げるため、それを無視する
            if (err.message === "NEXT_REDIRECT") {
                return
            }
            console.error(error)
            alert("投稿に失敗しました。詳細: " + err.message)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>新規作品投稿</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">作品タイトル *</Label>
                        <Input id="title" name="title" required placeholder="例: RX-78-2 ガンダム" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="kitName">キット名</Label>
                            <Input id="kitName" name="kitName" placeholder="例: HGUC 1/144 ガンダム" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maker">メーカー</Label>
                            <Input id="maker" name="maker" placeholder="例: バンダイ" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scale">スケール</Label>
                            <Input id="scale" name="scale" placeholder="例: 1/144" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genre">ジャンル</Label>
                            <Input id="genre" name="genre" placeholder="例: ガンプラ" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mainImage">メイン写真 *</Label>
                        <Input id="mainImage" name="mainImage" type="file" accept="image/*" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subImages">サブ写真（複数可）</Label>
                        <Input id="subImages" name="subImages" type="file" accept="image/*" multiple />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paints">使用塗料</Label>
                        <Textarea id="paints" name="paints" placeholder="例: ガンダムカラー ホワイト, Mr.カラー ブルー..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">説明・ポイント</Label>
                        <Textarea id="description" name="description" placeholder="改造した点やこだわったポイントなど" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">タグ（カンマ区切り）</Label>
                        <Input id="tags" name="tags" placeholder="例: 筆塗り, ウェザリング, オリジナルカラー" />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "投稿中..." : "作品を投稿する"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
