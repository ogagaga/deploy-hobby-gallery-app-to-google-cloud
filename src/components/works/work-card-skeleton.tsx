"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function WorkCardSkeleton() {
    return (
        <Card className="relative overflow-hidden border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5">
            <CardHeader className="p-0">
                {/* Image Area Skeleton */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Skeleton className="w-full h-full rounded-none" />
                    {/* Genre Badge Skeleton */}
                    <div className="absolute top-4 left-4 z-20">
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        {/* Title Skeleton */}
                        <Skeleton className="h-7 w-3/4 rounded-lg" />
                        {/* Subtitle / KitName Skeleton */}
                        <Skeleton className="h-4 w-1/2 rounded-md opacity-60" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Tag Skeletons */}
                        <Skeleton className="h-4 w-12 rounded-full opacity-40" />
                        <Skeleton className="h-4 w-10 rounded-full opacity-40" />
                        <Skeleton className="h-4 w-14 rounded-full opacity-40" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function WorkListSkeleton() {
    return (
        <div className="space-y-10">
            {/* Filter Bar Skeleton */}
            <div className="bg-white/40 dark:bg-zinc-900/40 p-8 rounded-[2.5rem] glass border-none shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                    <div className="w-full md:max-w-md space-y-3">
                        <Skeleton className="h-4 w-24 ml-1 mb-2" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                    <div className="w-full md:w-auto space-y-3">
                        <Skeleton className="h-4 w-32 ml-1 mb-2 md:hidden lg:block md:text-right" />
                        <div className="flex gap-2 justify-end">
                            <Skeleton className="h-8 w-16 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <WorkCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
