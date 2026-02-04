import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { WorkForm } from "@/components/works/work-form"

export default async function NewWorkPage() {
    const session = await auth()

    // 管理者以外はアクセス不可
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/")
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">作品を登録する</h1>
            <WorkForm />
        </div>
    )
}
