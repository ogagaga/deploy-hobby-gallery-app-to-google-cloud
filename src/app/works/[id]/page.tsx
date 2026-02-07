import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { WorkDetailClient } from "@/components/works/work-detail-client"

interface WorkDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
    const session = await auth()
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const { id } = await params

    const work = await prisma.work.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: {
                    order: "asc"
                }
            },
            tags: true,
        },
    })

    if (!work) {
        notFound()
    }

    return <WorkDetailClient work={work} isAdmin={isAdmin} />
}
