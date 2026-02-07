"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps extends ImageProps {
    containerClassName?: string
    onClick?: () => void
}

export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    onClick,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div
            className={cn("relative overflow-hidden group/optimage cursor-pointer", containerClassName)}
            onClick={onClick}
        >
            {isLoading && (
                <Skeleton className="absolute inset-0 z-20 w-full h-full" />
            )}
            <Image
                src={src}
                alt={alt}
                sizes={sizes}
                className={cn(
                    "transition-all duration-700 ease-in-out relative z-10",
                    isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        </div>
    )
}
