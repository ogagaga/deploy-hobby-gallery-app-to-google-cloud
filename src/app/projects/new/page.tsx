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
                <MotionItem className="flex items-center justify-between border-b pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight tracking-tighter">
                            新規シリーズ作成
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm">
                            新しいシリーズを登録します
                        </p>
                    </div>
                </MotionItem>

                <ProjectForm />
            </MotionContainer>
        </div>
    )
}
