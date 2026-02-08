import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { Storage } from "@google-cloud/storage"
import sharp from "sharp"

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME

export async function saveImage(file: File, prefix: string): Promise<string> {
    const inputBuffer = Buffer.from(await file.arrayBuffer())

    // マジックバイト（バイナリシグネチャ）によるファイル種別の検証
    // 不適切なファイル（実行ファイルやテキストファイル等）のアップロードを防止する
    const isAllowedImage = (buffer: Buffer): boolean => {
        // JPEG: FF D8 FF
        if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true
        // PNG: 89 50 4E 47
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true
        // WebP: RIFF (4bytes) WEBP (4bytes) -> 52 49 46 46 ... 57 45 42 50
        if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return true
        return false
    }

    if (!isAllowedImage(inputBuffer)) {
        throw new Error("Invalid file format. Only JPEG, PNG, and WebP are allowed.")
    }

    const fileName = `${Date.now()}-${prefix}-${file.name}`

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
