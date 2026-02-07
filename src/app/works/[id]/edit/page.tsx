import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { WorkForm } from "@/components/works/work-form"
import { getProjects } from "@/app/actions/project"

interface EditWorkPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
    const session = await auth()
    const { id } = await params

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/")
    }

    const work = await prisma.work.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: "asc" }
            },
            tags: true,
        }
    })

    if (!work) {
        redirect("/")
    }

    const projects = await getProjects()

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">作品を編集する</h1>
            <WorkForm initialData={work} projects={projects} />
        </div>
    )
}
