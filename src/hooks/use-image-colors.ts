"use client"

import { useState, useEffect } from "react"

export interface ColorPalette {
    vibrant?: string
    lightVibrant?: string
    darkVibrant?: string
    muted?: string
    lightMuted?: string
    darkMuted?: string
}

export function useImageColors(imageUrl: string | null) {
    const [colors, setColors] = useState<ColorPalette>({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!imageUrl || typeof window === "undefined") return

        let isMounted = true
        setIsLoading(true)

        // 動的インポートを使用して、クライアントサイドでのみ読み込む
        // エラーメッセージの指示に従い、browser エントリポイントを指定
        import("node-vibrant/browser").then((VibrantModule) => {
            if (!isMounted) return

            // node-vibrant v3.x のインポート形式に対応
            const Vibrant = (VibrantModule as any).Vibrant || (VibrantModule as any).default || VibrantModule

            if (typeof Vibrant === 'undefined' || !Vibrant.from) {
                console.error("[useImageColors] Vibrant is not properly loaded", VibrantModule)
                setIsLoading(false)
                return
            }

            Vibrant.from(imageUrl)
                .getPalette()
                .then((palette: any) => {
                    if (!isMounted) return

                    console.log("[useImageColors] Extracted palette:", palette)

                    // Swatch オブジェクトから HEX を取得する非常に堅牢な関数
                    const getHex = (swatch: any) => {
                        if (!swatch) return undefined

                        // 1. getHex() メソッドがあるか
                        if (typeof swatch.getHex === 'function') return swatch.getHex()

                        // 2. 直接 hex プロパティがあるか
                        if (swatch.hex) return swatch.hex

                        // 3. rgb プロパティ([r,g,b])があるか (node-vibrant の内部構造)
                        if (Array.isArray(swatch.rgb)) {
                            const r = Math.round(swatch.rgb[0]).toString(16).padStart(2, '0')
                            const g = Math.round(swatch.rgb[1]).toString(16).padStart(2, '0')
                            const b = Math.round(swatch.rgb[2]).toString(16).padStart(2, '0')
                            return `#${r}${g}${b}`
                        }

                        // 4. 文字列ならそのまま返す
                        if (typeof swatch === 'string' && swatch.startsWith('#')) return swatch

                        return undefined
                    }

                    const extractedColors: ColorPalette = {
                        vibrant: getHex(palette.Vibrant),
                        lightVibrant: getHex(palette.LightVibrant),
                        darkVibrant: getHex(palette.DarkVibrant),
                        muted: getHex(palette.Muted),
                        lightMuted: getHex(palette.LightMuted),
                        darkMuted: getHex(palette.DarkMuted),
                    }

                    console.log("[useImageColors] Extracted HEX colors:", extractedColors)

                    setColors(extractedColors)
                    setIsLoading(false)
                })
                .catch((err: any) => {
                    console.error("[useImageColors] Error extracting colors:", err)
                    if (isMounted) setIsLoading(false)
                })
        }).catch(err => {
            console.error("[useImageColors] Failed to load node-vibrant:", err)
            if (isMounted) setIsLoading(false)
        })

        return () => {
            isMounted = false
        }
    }, [imageUrl])

    return { colors, isLoading }
}
