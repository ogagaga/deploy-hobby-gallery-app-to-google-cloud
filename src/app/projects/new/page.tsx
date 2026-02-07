import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProjectForm } from "@/components/projects/project-form"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { FolderPlus } from "lucide-react"

export default async function NewProjectPage() {
    const session = await auth()

    // 管理者以外はアクセス不可
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/")
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <MotionContainer className="space-y-12">
                <MotionItem className="space-y-2 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
                        <FolderPlus className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight tracking-tighter">
                        新規プロジェクト作成
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        作品をまとめる新しいテーマやシリーズを定義します
                    </p>
                </MotionItem>

                <MotionItem>
                    <ProjectForm />
                </MotionItem>
            </MotionContainer>
        </div>
    )
}
