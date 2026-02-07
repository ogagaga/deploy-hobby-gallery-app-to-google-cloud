"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    if (!content) return null

    return (
        <div className={cn(
            "prose prose-zinc dark:prose-invert max-w-none",
            "prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground",
            "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-medium",
            "prose-strong:text-foreground prose-strong:font-bold",
            "prose-ul:list-disc prose-ol:list-decimal prose-li:text-muted-foreground",
            "prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic",
            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:p-4 prose-pre:rounded-2xl",
            "prose-a:text-primary prose-a:font-bold hover:prose-a:underline",
            className
        )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
