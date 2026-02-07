"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Edit3, Eye } from "lucide-react"

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    name?: string
    placeholder?: string
    rows?: number
}

export function MarkdownEditor({
    value,
    onChange,
    name,
    placeholder,
    rows = 10
}: MarkdownEditorProps) {
    return (
        <Tabs defaultValue="edit" className="w-full">
            <div className="flex items-center justify-between mb-2">
                <TabsList className="bg-muted/50 p-1 rounded-full h-9">
                    <TabsTrigger value="edit" className="rounded-full px-4 h-7 text-xs font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Edit3 className="w-3 h-3" />
                        編集
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="rounded-full px-4 h-7 text-xs font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Eye className="w-3 h-3" />
                        プレビュー
                    </TabsTrigger>
                </TabsList>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                    Markdown Supported
                </div>
            </div>

            <TabsContent value="edit" className="mt-0 ring-offset-background focus-visible:outline-none">
                <Textarea
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className="min-h-[250px] font-medium leading-relaxed"
                />
            </TabsContent>

            <TabsContent value="preview" className="mt-0 ring-offset-background focus-visible:outline-none">
                <div className="min-h-[250px] p-6 rounded-xl border bg-muted/5 ring-1 ring-zinc-200/50 dark:ring-zinc-800">
                    {value ? (
                        <MarkdownRenderer content={value} />
                    ) : (
                        <p className="text-muted-foreground text-sm italic">プレビューする内容がありません。</p>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}
