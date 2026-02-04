"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
    const work = await prisma.work.create({
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
    redirect("/")
}
