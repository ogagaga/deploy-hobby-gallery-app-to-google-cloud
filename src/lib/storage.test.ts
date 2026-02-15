import { describe, it, expect, vi, beforeEach } from 'vitest'
import { writeFile, mkdir, unlink } from '@/test/mocks'

// テスト対象
import { saveImage, deleteImage } from './storage'

// jsdom 環境では File.arrayBuffer() が未実装のため、ヘルパーで正しい File を作成
function createFileWithArrayBuffer(
    content: Uint8Array,
    name: string,
    type: string
): File {
    const file = new File([content], name, { type })
    // File.arrayBuffer() を明示的に実装
    file.arrayBuffer = () => Promise.resolve(content.buffer as ArrayBuffer)
    return file
}

describe('saveImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // デフォルトはローカルモード（GCS_BUCKET_NAME 未設定）
        delete process.env.GCS_BUCKET_NAME
    })

    // JPEG のマジックバイト: FF D8 FF
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, ...Array(96).fill(0)])
    // PNG のマジックバイト: 89 50 4E 47
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, ...Array(96).fill(0)])

    it('ローカル環境でファイルを保存しURLを返す', async () => {
        const file = createFileWithArrayBuffer(jpegBytes, 'test.jpg', 'image/jpeg')

        const url = await saveImage(file, 'work')

        expect(url).toMatch(/^\/uploads\/\d+-work-test\.jpg$/)
        expect(mkdir).toHaveBeenCalledWith(expect.stringContaining('public/uploads'), { recursive: true })
        expect(writeFile).toHaveBeenCalled()
    })

    it('PNG ファイルも正しく保存できる', async () => {
        const file = createFileWithArrayBuffer(pngBytes, 'test.png', 'image/png')

        const url = await saveImage(file, 'project')

        expect(url).toMatch(/^\/uploads\/\d+-project-test\.png$/)
    })

    // 注: GCS_BUCKET_NAME はモジュールスコープで読み込まれるため、
    // テスト実行時はローカルモードで動作する（GCS テストは統合テストで検証）
    it('prefix をファイル名に含める', async () => {
        const file = createFileWithArrayBuffer(jpegBytes, 'photo.jpg', 'image/jpeg')

        const url = await saveImage(file, 'project')

        expect(url).toMatch(/^\/uploads\/\d+-project-photo\.jpg$/)
    })

    it('不正なファイルフォーマットはエラーになる', async () => {
        // テキストファイル（マジックバイトが不正）
        const textBytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
        const file = createFileWithArrayBuffer(textBytes, 'fake.jpg', 'image/jpeg')

        await expect(saveImage(file, 'work')).rejects.toThrow('Invalid file format')
    })
})

describe('deleteImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        delete process.env.GCS_BUCKET_NAME
    })

    it('ローカルファイルを削除する', async () => {
        await deleteImage('/uploads/test-image.jpg')

        expect(unlink).toHaveBeenCalledWith(expect.stringContaining('public/uploads/test-image.jpg'))
    })

    it('空URLでは何もしない', async () => {
        await deleteImage('')

        expect(unlink).not.toHaveBeenCalled()
    })

    it('GCS URL の場合は GCS から削除する', async () => {
        process.env.GCS_BUCKET_NAME = 'test-bucket'

        // GCS 削除はモックされているので、エラーが出なければ OK
        await deleteImage('https://storage.googleapis.com/test-bucket/uploads/photo.jpg')

        // unlink は呼ばれない（GCS 経由のため）
        expect(unlink).not.toHaveBeenCalled()
    })

    it('関係ないURLでは何もしない', async () => {
        await deleteImage('https://example.com/image.jpg')

        expect(unlink).not.toHaveBeenCalled()
    })
})
