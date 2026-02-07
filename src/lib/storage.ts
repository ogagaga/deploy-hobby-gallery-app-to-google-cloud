import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { Storage } from "@google-cloud/storage"
import sharp from "sharp"

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME

export async function saveImage(file: File, prefix: string): Promise<string> {
    const fileName = `${Date.now()}-${prefix}-${file.name}`
    const inputBuffer = Buffer.from(await file.arrayBuffer())

    // sharp を使用してメタデータを削除し、画像の向き（Orientation）を補正
    // rotate() は EXIF の Orientation タグに基づいて画像を回転させ、タグをリセットする
    // デフォルトでメタデータは削除される（withMetadata を呼ばない限り）
    const buffer = await sharp(inputBuffer)
        .rotate()
        .toBuffer()

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

export async function deleteImage(url: string) {
    if (!url) return;

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
