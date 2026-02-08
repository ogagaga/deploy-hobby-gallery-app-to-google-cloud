"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { saveImage, deleteImage } from "@/lib/storage"
import { createWorkSchema, updateWorkSchema } from "@/lib/validations"

// 権限チェックヘルパー
export async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
        throw new Error("管理者権限が必要です。")
    }
}


export async function createWork(formData: FormData) {
    try {
        await checkAdmin()

        // FormData からオブジェクトに変換（Zod で検証するため）
        const rawData = {
            title: formData.get("title"),
            kitName: formData.get("kitName"),
            maker: formData.get("maker"),
            scale: formData.get("scale"),
            genre: formData.get("genre"),
            paints: formData.get("paints"),
            description: formData.get("description"),
            tags: formData.get("tags"),
            projectId: formData.get("projectId"), // 追加
            endDate: formData.get("endDate"), // 追加
            mainImage: formData.get("mainImage"),
            subImages: formData.getAll("subImages"),
        }

        // バリデーション実行
        const validated = createWorkSchema.safeParse(rawData)
        if (!validated.success) {
            return {
                success: false,
                error: "入力内容に不備があります。",
                details: validated.error.flatten().fieldErrors
            }
        }

        const data = validated.data
        const mainImageFile = data.mainImage as File
        const subImageFiles = (data.subImages || []) as File[]

        // メイン画像の保存
        const mainImageUrl = await saveImage(mainImageFile, "main")

        // サブ画像の保存
        const subImageUrls: string[] = []
        for (let i = 0; i < subImageFiles.length; i++) {
            const file = subImageFiles[i]
            if (file.size === 0) continue
            const url = await saveImage(file, `sub-${i}`)
            subImageUrls.push(url)
        }

        // タグの処理
        const tagsString = data.tags || ""
        const tagNames = tagsString.split(",").map(t => t.trim()).filter(Boolean)

        // データベースへの保存
        await prisma.work.create({
            data: {
                title: data.title,
                kitName: data.kitName,
                maker: data.maker,
                scale: data.scale,
                genre: data.genre,
                paints: data.paints,
                description: data.description,
                mainImage: mainImageUrl,
                projectId: data.projectId || null, // 追加
                endDate: data.endDate ? new Date(data.endDate) : null, // 追加
                images: {
                    create: subImageUrls.map((url, index) => ({
                        url,
                        order: index
                    }))
                },
                tags: {
                    connectOrCreate: tagNames.map(name => ({
                        where: { name },
                        create: { name }
                    }))
                }
            }
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("[createWork] Error:", error)
        return { success: false, error: "サーバーエラーが発生しました。" }
    }
}

export async function updateWork(id: string, formData: FormData) {
    try {
        await checkAdmin()

        const rawData = {
            title: formData.get("title"),
            kitName: formData.get("kitName"),
            maker: formData.get("maker"),
            scale: formData.get("scale"),
            genre: formData.get("genre"),
            paints: formData.get("paints"),
            description: formData.get("description"),
            tags: formData.get("tags"),
            projectId: formData.get("projectId"), // 追加
            endDate: formData.get("endDate"), // 追加
            mainImage: formData.get("mainImage"),
            deleteImageUrls: formData.getAll("deleteImageUrls"),
            imageOrder: formData.get("imageOrder"),
        }

        // バリデーション実行
        const validated = updateWorkSchema.safeParse(rawData)
        if (!validated.success) {
            return {
                success: false,
                error: "入力内容に不備があります。",
                details: validated.error.flatten().fieldErrors
            }
        }

        const data = validated.data
        const subImageFiles = formData.getAll("subImages") as File[] // subImages は schema 外で扱う（複数のため）

        // 既存データの取得
        const existingWork = await prisma.work.findUnique({
            where: { id },
            include: { images: true }
        })

        if (!existingWork) return { success: false, error: "作品が見つかりません。" }

        let mainImageUrl = existingWork.mainImage
        const mainImageFile = data.mainImage as File | undefined

        // メイン画像の更新がある場合
        if (mainImageFile && mainImageFile.size > 0) {
            mainImageUrl = await saveImage(mainImageFile, "main")
            await deleteImage(existingWork.mainImage)
        }

        const tagNames = (data.tags || "").split(",").map(t => t.trim()).filter(Boolean)
        const imageOrder = data.imageOrder ? JSON.parse(data.imageOrder) : []

        await prisma.$transaction(async (tx: any) => {
            // 作品情報の更新
            await tx.work.update({
                where: { id },
                data: {
                    title: data.title,
                    kitName: data.kitName || null,
                    maker: data.maker || null,
                    scale: data.scale || null,
                    genre: data.genre || null,
                    paints: data.paints || null,
                    description: data.description || null,
                    mainImage: mainImageUrl,
                    projectId: data.projectId || null, // 追加
                    endDate: data.endDate ? new Date(data.endDate) : null, // 追加
                    tags: {
                        set: [],
                        connectOrCreate: tagNames.map(name => ({
                            where: { name },
                            create: { name }
                        }))
                    }
                }
            })

            // 指定された画像の削除
            const deleteUrls = data.deleteImageUrls || []
            if (deleteUrls.length > 0) {
                await tx.image.deleteMany({
                    where: {
                        url: { in: deleteUrls },
                        workId: id
                    }
                })
                for (const url of deleteUrls) {
                    await deleteImage(url)
                }
            }

            // 新規サブ写真の保存
            const newImageUrls: string[] = []
            for (const file of subImageFiles) {
                if (file.size > 0) {
                    const url = await saveImage(file, "sub")
                    const newImg = await tx.image.create({
                        data: {
                            url,
                            workId: id,
                            order: 999
                        }
                    })
                    newImageUrls.push(newImg.url)
                }
            }

            // 全画像の順序を一括更新
            let newIdx = 0
            for (let i = 0; i < imageOrder.length; i++) {
                const item = imageOrder[i]
                if (item.id) {
                    await tx.image.update({
                        where: { id: item.id },
                        data: { order: i }
                    })
                } else if (item.isNew) {
                    const url = newImageUrls[newIdx++]
                    if (url) {
                        await tx.image.updateMany({
                            where: { url, workId: id },
                            data: { order: i }
                        })
                    }
                }
            }
        })

        revalidatePath("/")
        revalidatePath(`/works/${id}`)
        return { success: true, id }
    } catch (error) {
        console.error("[updateWork] Error:", error)
        return { success: false, error: "サーバーエラーが発生しました。" }
    }
}

export async function deleteWork(id: string) {
    try {
        await checkAdmin()

        const work = await prisma.work.findUnique({
            where: { id },
            include: { images: true }
        })

        if (!work) return { success: false, error: "作品が見つかりません。" }

        const filesToDelete = [work.mainImage, ...work.images.map(img => img.url)]
        for (const fileUrl of filesToDelete) {
            await deleteImage(fileUrl)
        }

        await prisma.work.delete({
            where: { id }
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("[deleteWork] Error:", error)
        return { success: false, error: "削除中にエラーが発生しました。" }
    }
}

export async function getTags() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: "asc",
            },
        })
        return tags.map(tag => tag.name)
    } catch (error) {
        console.error("[getTags] Error:", error)
        return []
    }
}

export async function getWorks(page: number = 1, limit: number = 8) {
    try {
        const skip = (page - 1) * limit
        const works = await prisma.work.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                tags: true,
                images: {
                    select: { id: true }
                },
                project: {
                    select: { name: true }
                }
            },
        })

        const total = await prisma.work.count()

        return {
            success: true,
            works,
            hasMore: skip + works.length < total,
            total
        }
    } catch (error) {
        console.error("[getWorks] Error:", error)
        return { success: false, works: [], hasMore: false, total: 0 }
    }
}
