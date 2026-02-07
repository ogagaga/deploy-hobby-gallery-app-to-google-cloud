"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProject } from "@/app/actions/project"
import { Button } from "@/components/ui/button"
import { Edit3, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProjectActionsProps {
    id: string
}

export function ProjectActions({ id }: ProjectActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteProject(id)
            if (result.success) {
                toast.success("プロジェクトを削除しました")
                router.push("/projects")
            } else {
                toast.error(result.error || "削除に失敗しました")
            }
        } catch (error) {
            toast.error("サーバーエラーが発生しました")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex gap-4">
            <Button asChild variant="outline" className="rounded-full px-6 flex items-center gap-2 font-bold h-12">
                <Link href={`/projects/${id}/edit`}>
                    <Edit3 className="w-4 h-4" />
                    編集
                </Link>
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="rounded-full px-6 flex items-center gap-2 font-bold text-destructive hover:bg-destructive/10 h-12">
                        <Trash2 className="w-4 h-4" />
                        削除
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
                    <AlertDialogHeader className="space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-2">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight text-center">本当に削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base font-medium leading-relaxed">
                            このプロジェクトを削除しても、所属する作品は削除されず、「所属なし」の状態になります。この操作は取り消せません。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-4 sm:justify-center">
                        <AlertDialogCancel className="rounded-full h-14 px-8 border-none bg-muted hover:bg-muted/80 font-bold transition-all">キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-full h-14 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold shadow-xl shadow-destructive/20 transition-all"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "削除する"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
