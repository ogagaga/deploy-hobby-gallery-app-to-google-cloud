"use server"

import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { Storage } from "@google-cloud/storage"

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME

async function saveImage(file: File, prefix: string): Promise<string> {
    const fileName = `${Date.now()}-${prefix}-${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    if (bucketName) {
        // Cloud Storage に保存
        const bucket = storage.bucket(bucketName)
        const gcsFile = bucket.file(`uploads/${fileName}`)
        await gcsFile.save(buffer, {
            contentType: file.type,
        })
        // 公開URLを返す
        return `https://storage.googleapis.com/${bucketName}/uploads/${fileName}`
    } else {
        // ローカルに保存
        const uploadDir = join(process.cwd(), "public", "uploads")
        await mkdir(uploadDir, { recursive: true })
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        return `/uploads/${fileName}`
    }
}

async function deleteImage(url: string) {
    if (bucketName && url.startsWith("https://storage.googleapis.com")) {
        // Cloud Storage から削除
        const bucket = storage.bucket(bucketName)
        const fileName = url.split(`${bucketName}/`)[1]
        try {
            await bucket.file(fileName).delete()
        } catch (e) {
            console.error(`Failed to delete GCS file: ${fileName}`, e)
        }
    } else if (url.startsWith("/uploads/")) {
        // ローカルから削除
        const filePath = join(process.cwd(), "public", url)
        try {
            await unlink(filePath)
        } catch (e) {
            console.error(`Failed to delete local file: ${filePath}`, e)
        }
    }
}

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

    const deleteImageUrls = formData.getAll("deleteImageUrls") as string[]
    const subImageFiles = formData.getAll("subImages") as File[]

    // 既存データの取得
    const existingWork = await prisma.work.findUnique({
        where: { id },
        include: { images: true }
    })

    if (!existingWork) throw new Error("Work not found")

    let mainImageUrl = existingWork.mainImage

    // メイン画像の更新がある場合
    if (mainImageFile && mainImageFile.size > 0) {
        mainImageUrl = await saveImage(mainImageFile, "main")
        // 古いファイルを削除
        await deleteImage(existingWork.mainImage)
    }

    const tagNames = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : []

    const imageOrderJson = formData.get("imageOrder") as string
    const imageOrder = imageOrderJson ? JSON.parse(imageOrderJson) : []

    await prisma.$transaction(async (tx: any) => {
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

        // 指定された画像の削除
        if (deleteImageUrls.length > 0) {
            await tx.image.deleteMany({
                where: {
                    url: { in: deleteImageUrls },
                    workId: id
                }
            })
            // ストレージからも削除
            for (const url of deleteImageUrls) {
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
                        order: 999 // 一旦大きな値を入れておく（後で一括更新）
                    }
                })
                newImageUrls.push(newImg.url)
            }
        }

        // 全画像の順序を一括更新
        // imageOrder: Array<{ id?: string, url?: string, isNew?: boolean, tempId?: string }>
        // newImageUrls はアップロード順に並んでいるはずなので、isNew のものに順番に割り当てる
        let newIdx = 0
        for (let i = 0; i < imageOrder.length; i++) {
            const item = imageOrder[i]
            if (item.id) {
                // 既存画像
                await tx.image.update({
                    where: { id: item.id },
                    data: { order: i }
                })
            } else if (item.isNew) {
                // 新規画像
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
        await deleteImage(fileUrl)
    }

    // データベースからの削除
    await prisma.work.delete({
        where: { id }
    })

    revalidatePath("/")
    return { success: true }
}

export async function getTags() {
    const tags = await prisma.tag.findMany({
        orderBy: {
            name: "asc",
        },
    })
    return tags.map(tag => tag.name)
}
