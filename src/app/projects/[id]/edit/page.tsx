import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { ProjectForm } from "@/components/projects/project-form"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { Edit3 } from "lucide-react"

interface EditProjectPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const session = await auth()
    const { id } = await params

    // 管理者以外はアクセス不可
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/")
    }

    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <MotionContainer className="space-y-12">
                <MotionItem className="space-y-2 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
                        <Edit3 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight tracking-tighter">
                        シリーズ情報の編集
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        シリーズ名や説明文、カバー画像を変更できます
                    </p>
                </MotionItem>

                <MotionItem>
                    <ProjectForm initialData={project} />
                </MotionItem>
            </MotionContainer>
        </div>
    )
}
