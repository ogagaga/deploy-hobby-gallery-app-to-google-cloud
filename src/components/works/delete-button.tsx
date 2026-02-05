"use client"

import { useState } from "react"
import { deleteWork } from "@/app/actions/work"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    workId: string
    workTitle: string
}

export function DeleteButton({ workId, workTitle }: DeleteButtonProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const handleDelete = async () => {
        setIsPending(true)
        try {
            const result = await deleteWork(workId)
            if (result.success) {
                toast.success("作品を削除しました")
                router.push("/")
            }
        } catch (error) {
            console.error(error)
            toast.error("削除に失敗しました")
            setIsPending(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                        作品「{workTitle}」を完全に削除します。この操作は取り消せません。
                        また、サーバー上の画像ファイルも全て削除されます。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "作品を削除する"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
