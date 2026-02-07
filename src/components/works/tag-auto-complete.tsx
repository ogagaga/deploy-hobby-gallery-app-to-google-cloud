"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { getTags } from "@/app/actions/work"
import { cn } from "@/lib/utils"

interface TagAutoCompleteProps {
    defaultValue?: string
    name?: string
    className?: string
}

export function TagAutoComplete({ defaultValue = "", name, className }: TagAutoCompleteProps) {
    const [inputValue, setInputValue] = useState(defaultValue)
    const [allTags, setAllTags] = useState<string[]>([])
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchTags() {
            const tags = await getTags()
            setAllTags(tags)
        }
        fetchTags()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)

        // 現在入力中のタグ（最後のカンマ以降）を抽出
        const parts = value.split(",")
        const currentPart = parts[parts.length - 1].trim().toLowerCase()

        if (currentPart.length > 0) {
            const filtered = allTags.filter(
                tag => tag.toLowerCase().includes(currentPart) &&
                    !parts.map(p => p.trim().toLowerCase()).includes(tag.toLowerCase())
            )
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
        setSelectedIndex(-1)
    }

    const selectSuggestion = (tag: string) => {
        const parts = inputValue.split(",")
        parts[parts.length - 1] = ` ${tag}`
        const newValue = parts.join(",").trim() + ", "
        setInputValue(newValue)
        setShowSuggestions(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault()
            selectSuggestion(suggestions[selectedIndex])
        } else if (e.key === "Escape") {
            setShowSuggestions(false)
        }
    }

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <Input
                id={name}
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="ガンプラ, 筆塗り, ウェザリング"
            />
            {showSuggestions && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-auto py-2">
                    {suggestions.map((tag, index) => (
                        <li
                            key={tag}
                            className={cn(
                                "px-4 py-2 cursor-pointer text-sm transition-colors",
                                index === selectedIndex
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                            onClick={() => selectSuggestion(tag)}
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
