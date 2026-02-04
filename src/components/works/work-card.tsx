import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkCardProps {
    work: {
        id: string
        title: string
        kitName: string | null
        maker: string | null
        genre: string | null
        mainImage: string
        tags: { name: string }[]
    }
}

export function WorkCard({ work }: WorkCardProps) {
    return (
        <Link href={`/works/${work.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={work.mainImage}
                        alt={work.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xl line-clamp-1">{work.title}</CardTitle>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                        {work.kitName} {work.maker && `(${work.maker})`}
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                    <div className="flex flex-wrap gap-1 mt-2">
                        {work.genre && (
                            <Badge variant="secondary" className="text-xs">
                                {work.genre}
                            </Badge>
                        )}
                        {work.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.name} variant="outline" className="text-xs">
                                #{tag.name}
                            </Badge>
                        ))}
                        {work.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-1">...</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
