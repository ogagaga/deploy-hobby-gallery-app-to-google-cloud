"use server"

import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

export async function createWork(formData: FormData) {
    const session = await auth()
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        throw new Error("Unauthorized")
    }

    const title = formData.get("title") as string
    const kitName = formData.get("kitName") as string
    const maker = formData.get("maker") as string
    const scale = formData.get("scale") as string
    const genre = formData.get("genre") as string
    const paints = formData.get("paints") as string
    const description = formData.get("description") as string
    const tagsString = formData.get("tags") as string

    const mainImageFile = formData.get("mainImage") as File
    const subImageFiles = formData.getAll("subImages") as File[]

    // 画像保存用ディレクトリの確保
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // メイン画像の保存
    const mainImageName = `${Date.now()}-main-${mainImageFile.name}`
    const mainImagePath = join(uploadDir, mainImageName)
    const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer())
    await writeFile(mainImagePath, mainImageBuffer)
    const mainImageUrl = `/uploads/${mainImageName}`

    // サブ画像の保存
    const subImageUrls: string[] = []
    for (let i = 0; i < subImageFiles.length; i++) {
        const file = subImageFiles[i]
        if (file.size === 0) continue
        const name = `${Date.now()}-sub-${i}-${file.name}`
        const path = join(uploadDir, name)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path, buffer)
        subImageUrls.push(`/uploads/${name}`)
    }

    // タグの処理
    const tagNames = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : []

    // データベースへの保存
    await prisma.work.create({
        data: {
            title,
            kitName,
            maker,
            scale,
            genre,
            paints,
            description,
            mainImage: mainImageUrl,
            images: {
                create: subImageUrls.map(url => ({ url }))
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
}

export async function updateWork(id: string, formData: FormData) {
    const session = await auth()
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        throw new Error("Unauthorized")
    }

    const title = formData.get("title") as string
    const kitName = formData.get("kitName") as string
    const maker = formData.get("maker") as string
    const scale = formData.get("scale") as string
    const genre = formData.get("genre") as string
    const paints = formData.get("paints") as string
    const description = formData.get("description") as string
    const tagsString = formData.get("tags") as string
    const mainImageFile = formData.get("mainImage") as File | null

    // 既存データの取得
    const existingWork = await prisma.work.findUnique({
        where: { id },
        include: { images: true }
    })

    if (!existingWork) throw new Error("Work not found")

    let mainImageUrl = existingWork.mainImage

    // メイン画像の更新がある場合
    if (mainImageFile && mainImageFile.size > 0) {
        const uploadDir = join(process.cwd(), "public", "uploads")
        const mainImageName = `${Date.now()}-main-${mainImageFile.name}`
        const mainImagePath = join(uploadDir, mainImageName)
        const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer())
        await writeFile(mainImagePath, mainImageBuffer)
        mainImageUrl = `/uploads/${mainImageName}`

        // 古いファイルを削除
        const oldPath = join(process.cwd(), "public", existingWork.mainImage)
        try { await unlink(oldPath) } catch (e) { console.error("Failed to delete old image", e) }
    }

    const tagNames = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : []

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 作品情報の更新
        await tx.work.update({
            where: { id },
            data: {
                title,
                kitName,
                maker,
                scale,
                genre,
                paints,
                description,
                mainImage: mainImageUrl,
                tags: {
                    set: [], // 一旦リセット
                    connectOrCreate: tagNames.map(name => ({
                        where: { name },
                        create: { name }
                    }))
                }
            }
        })
    })

    revalidatePath("/")
    revalidatePath(`/works/${id}`)
    return { success: true, id }
}

export async function deleteWork(id: string) {
    const session = await auth()
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        throw new Error("Unauthorized")
    }

    const work = await prisma.work.findUnique({
        where: { id },
        include: { images: true }
    })

    if (!work) throw new Error("Work not found")

    // ファイルの削除
    const filesToDelete = [work.mainImage, ...work.images.map((img: { url: string }) => img.url)]
    for (const fileUrl of filesToDelete) {
        const filePath = join(process.cwd(), "public", fileUrl)
        try {
            await unlink(filePath)
        } catch (e) {
            console.error(`Failed to delete file: ${filePath}`, e)
        }
    }

    // データベースからの削除
    await prisma.work.delete({
        where: { id }
    })

    revalidatePath("/")
    return { success: true }
}
