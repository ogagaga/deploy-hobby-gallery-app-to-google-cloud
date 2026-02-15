import { describe, it, expect } from 'vitest'
import {
    imageFileSchema,
    optionalImageFileSchema,
    workSchema,
    createWorkSchema,
    projectSchema,
} from './validations'

// --- imageFileSchema ---
describe('imageFileSchema', () => {
    it('正常なJPEG画像ファイルを受け入れる', () => {
        const file = new File(['image-content'], 'test.jpg', { type: 'image/jpeg' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(true)
    })

    it('正常なPNG画像ファイルを受け入れる', () => {
        const file = new File(['image-content'], 'test.png', { type: 'image/png' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(true)
    })

    it('正常なWebP画像ファイルを受け入れる', () => {
        const file = new File(['image-content'], 'test.webp', { type: 'image/webp' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(true)
    })

    it('空のファイルを拒否する', () => {
        const file = new File([], 'test.jpg', { type: 'image/jpeg' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(false)
    })

    it('5MBを超えるファイルを拒否する', () => {
        // 6MBのダミーデータ
        const largeContent = new Uint8Array(6 * 1024 * 1024)
        const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(false)
    })

    it('不正なMIMEタイプを拒否する', () => {
        const file = new File(['content'], 'test.gif', { type: 'image/gif' })
        const result = imageFileSchema.safeParse(file)
        expect(result.success).toBe(false)
    })

    it('nullを拒否する', () => {
        const result = imageFileSchema.safeParse(null)
        expect(result.success).toBe(false)
    })
})

// --- optionalImageFileSchema ---
describe('optionalImageFileSchema', () => {
    it('正常なJPEG画像ファイルを受け入れる', () => {
        const file = new File(['image-content'], 'test.jpg', { type: 'image/jpeg' })
        const result = optionalImageFileSchema.safeParse(file)
        expect(result.success).toBe(true)
    })

    it('空のファイルを受け入れる（オプショナルのため）', () => {
        const file = new File([], 'test.jpg', { type: 'image/jpeg' })
        const result = optionalImageFileSchema.safeParse(file)
        expect(result.success).toBe(true)
    })

    it('nullを受け入れる（オプショナルのため）', () => {
        const result = optionalImageFileSchema.safeParse(null)
        expect(result.success).toBe(true)
    })

    it('5MBを超えるファイルを拒否する', () => {
        const largeContent = new Uint8Array(6 * 1024 * 1024)
        const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })
        const result = optionalImageFileSchema.safeParse(file)
        expect(result.success).toBe(false)
    })

    it('不正なMIMEタイプを拒否する', () => {
        const file = new File(['content'], 'test.gif', { type: 'image/gif' })
        const result = optionalImageFileSchema.safeParse(file)
        expect(result.success).toBe(false)
    })
})

// --- workSchema ---
describe('workSchema', () => {
    it('正常な入力を受け入れる', () => {
        const result = workSchema.safeParse({
            title: 'テスト作品',
            kitName: 'テストキット',
            maker: 'テストメーカー',
            scale: '1/144',
            genre: 'ガンプラ',
            description: '説明文',
            tags: 'tag1,tag2',
        })
        expect(result.success).toBe(true)
    })

    it('タイトルが空の場合は拒否する', () => {
        const result = workSchema.safeParse({
            title: '',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.title).toBeDefined()
        }
    })

    it('タイトルが100文字を超えると拒否する', () => {
        const result = workSchema.safeParse({
            title: 'a'.repeat(101),
        })
        expect(result.success).toBe(false)
    })

    it('オプショナルフィールドが空文字でも受け入れる', () => {
        const result = workSchema.safeParse({
            title: 'テスト',
            kitName: '',
            maker: '',
            scale: '',
            genre: '',
            description: '',
            tags: '',
            projectId: '',
            endDate: '',
        })
        expect(result.success).toBe(true)
    })

    it('キット名が100文字を超えると拒否する', () => {
        const result = workSchema.safeParse({
            title: 'テスト',
            kitName: 'a'.repeat(101),
        })
        expect(result.success).toBe(false)
    })

    it('説明文が5000文字を超えると拒否する', () => {
        const result = workSchema.safeParse({
            title: 'テスト',
            description: 'a'.repeat(5001),
        })
        expect(result.success).toBe(false)
    })
})

// --- createWorkSchema ---
describe('createWorkSchema', () => {
    it('メイン画像が必須', () => {
        const result = createWorkSchema.safeParse({
            title: 'テスト作品',
            mainImage: null,
        })
        expect(result.success).toBe(false)
    })

    it('正常なデータを受け入れる', () => {
        const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
        const result = createWorkSchema.safeParse({
            title: 'テスト作品',
            mainImage: file,
        })
        expect(result.success).toBe(true)
    })
})

// --- projectSchema ---
describe('projectSchema', () => {
    it('正常なデータを受け入れる', () => {
        const result = projectSchema.safeParse({
            name: 'テストシリーズ',
            description: 'シリーズの説明',
        })
        expect(result.success).toBe(true)
    })

    it('名前が空の場合は拒否する', () => {
        const result = projectSchema.safeParse({
            name: '',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.name).toBeDefined()
        }
    })

    it('名前が100文字を超えると拒否する', () => {
        const result = projectSchema.safeParse({
            name: 'a'.repeat(101),
        })
        expect(result.success).toBe(false)
    })

    it('説明文が2000文字を超えると拒否する', () => {
        const result = projectSchema.safeParse({
            name: 'テスト',
            description: 'a'.repeat(2001),
        })
        expect(result.success).toBe(false)
    })

    it('説明文が空文字でも受け入れる', () => {
        const result = projectSchema.safeParse({
            name: 'テスト',
            description: '',
        })
        expect(result.success).toBe(true)
    })
})
