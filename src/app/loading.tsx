import { WorkListSkeleton } from "@/components/works/work-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-10">
            {/* Header Area Skeleton */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-10 border-b pb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {/* Title Skeleton */}
                            <Skeleton className="h-10 w-64 rounded-xl" />
                            {/* Intro Link Skeleton */}
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        {/* Count Skeleton */}
                        <Skeleton className="h-5 w-48 rounded-md" />
                    </div>
                    {/* Post Button Skeleton */}
                    <Skeleton className="h-14 w-40 rounded-full" />
                </div>

                {/* Main List Skeleton */}
                <WorkListSkeleton />
            </div>
        </div>
    )
}
