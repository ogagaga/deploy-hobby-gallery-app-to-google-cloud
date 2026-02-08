"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { checkAdmin } from "./work"
import { saveImage, deleteImage } from "@/lib/storage"
import { createProjectSchema, updateProjectSchema } from "@/lib/validations"

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: { works: true }
                }
            }
        })
        return projects
    } catch (error) {
        console.error("[getProjects] Error:", error)
        return []
    }
}

export async function createProject(formData: FormData) {
    try {
        await checkAdmin()

        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            mainImage: formData.get("mainImage"),
        }

        const validated = createProjectSchema.safeParse(rawData)
        if (!validated.success) {
            return {
                success: false,
                error: "入力内容に不備があります。",
                details: validated.error.flatten().fieldErrors
            }
        }

        let mainImageUrl = null
        const imageFile = validated.data.mainImage as File
        if (imageFile && imageFile.size > 0) {
            mainImageUrl = await saveImage(imageFile, "project")
        }

        const project = await prisma.project.create({
            data: {
                name: validated.data.name,
                description: validated.data.description,
                mainImage: mainImageUrl,
            },
        })

        revalidatePath("/projects")
        revalidatePath("/works/new")

        return { success: true, id: project.id }
    } catch (error) {
        console.error("[createProject] Error:", error)
        return { success: false, error: "サーバーエラーが発生しました。" }
    }
}

export async function updateProject(id: string, formData: FormData) {
    try {
        await checkAdmin()

        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            mainImage: formData.get("mainImage"),
        }

        const validated = updateProjectSchema.safeParse(rawData)
        if (!validated.success) {
            return {
                success: false,
                error: "入力内容に不備があります。",
                details: validated.error.flatten().fieldErrors
            }
        }

        const existingProject = await prisma.project.findUnique({
            where: { id }
        })

        if (!existingProject) {
            return { success: false, error: "シリーズが見つかりません。" }
        }

        let mainImageUrl = existingProject.mainImage
        const imageFile = validated.data.mainImage as File

        if (imageFile && imageFile.size > 0) {
            // 新しい画像がある場合は保存し、古い画像を削除
            if (existingProject.mainImage) {
                await deleteImage(existingProject.mainImage)
            }
            mainImageUrl = await saveImage(imageFile, "project")
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                name: validated.data.name,
                description: validated.data.description,
                mainImage: mainImageUrl
            },
        })

        revalidatePath("/projects")
        revalidatePath(`/projects/${id}`)
        revalidatePath("/works/new")
        revalidatePath("/")

        return { success: true, id: project.id }
    } catch (error) {
        console.error("[updateProject] Error:", error)
        return { success: false, error: "サーバーエラーが発生しました。" }
    }
}

export async function deleteProject(id: string) {
    try {
        await checkAdmin()

        await prisma.project.delete({
            where: { id },
        })

        revalidatePath("/projects")
        return { success: true }
    } catch (error) {
        console.error("[deleteProject] Error:", error)
        return { success: false, error: "削除に失敗しました。" }
    }
}
