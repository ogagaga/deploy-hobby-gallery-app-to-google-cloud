import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { WorkForm } from "@/components/works/work-form"

interface EditWorkPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
    const session = await auth()
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/")
    }

    const { id } = await params

    const work = await prisma.work.findUnique({
        where: { id },
        include: {
            tags: true,
        },
    })

    if (!work) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-sm" />
                <h1 className="text-4xl font-black tracking-tight tracking-tighter">作品情報の編集</h1>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border shadow-sm">
                <WorkForm initialData={work} />
            </div>
        </div>
    )
}
