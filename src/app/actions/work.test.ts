import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock, authMock } from '@/test/mocks'

// revalidatePath を明示的にモック化
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// モック定義の後に実体をロード
import { createWork, updateWork, deleteWork } from './work'
import { revalidatePath } from 'next/cache'

describe('Work Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.ADMIN_EMAIL = 'admin@example.com'
    })

    describe('createWork', () => {
        it('throws error if not authenticated', async () => {
            authMock.mockResolvedValue(null)
            const formData = new FormData()
            await expect(createWork(formData)).rejects.toThrow('Unauthorized')
        })

        it('throws error if not admin', async () => {
            authMock.mockResolvedValue({ user: { email: 'user@example.com' } })
            const formData = new FormData()
            await expect(createWork(formData)).rejects.toThrow('Unauthorized')
        })

        it('creates a work successfully when admin', async () => {
            authMock.mockResolvedValue({ user: { email: 'admin@example.com' } })

            const formData = new FormData()
            formData.append('title', 'New Work')

            // arrayBuffer が jsdom/node環境で未定義の場合があるため、モックを注入
            const mockFile = new File([''], 'main.jpg', { type: 'image/jpeg' })
            mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0))

            formData.append('mainImage', mockFile)
            formData.append('tags', 'tag1, tag2')

            prismaMock.work.create.mockResolvedValue({ id: 'new-id' })

            const result = await createWork(formData)

            expect(result).toEqual({ success: true })
            expect(prismaMock.work.create).toHaveBeenCalled()
            expect(revalidatePath).toHaveBeenCalledWith('/')
        })
    })

    describe('deleteWork', () => {
        it('deletes work and its files', async () => {
            authMock.mockResolvedValue({ user: { email: 'admin@example.com' } })

            const mockWork = {
                id: '1',
                mainImage: '/uploads/main.jpg',
                images: [{ url: '/uploads/sub1.jpg' }]
            }
            prismaMock.work.findUnique.mockResolvedValue(mockWork)

            await deleteWork('1')

            expect(prismaMock.work.delete).toHaveBeenCalledWith({ where: { id: '1' } })
            expect(revalidatePath).toHaveBeenCalledWith('/')
        })
    })

    describe('updateWork', () => {
        it('updates basic info and handles sub-images addition/deletion', async () => {
            authMock.mockResolvedValue({ user: { email: 'admin@example.com' } })

            const existingWork = {
                id: '1',
                mainImage: '/uploads/old-main.jpg',
                images: [{ id: 'img1', url: '/uploads/sub1.jpg' }]
            }
            prismaMock.work.findUnique.mockResolvedValue(existingWork)

            const formData = new FormData()
            formData.append('title', 'Updated Title')
            formData.append('tags', 'tag1')

            // 新規サブ写真の追加 (2枚)
            const newSubFile1 = new File(['hello'], 'new-sub1.jpg', { type: 'image/jpeg' })
            newSubFile1.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0))
            const newSubFile2 = new File(['world'], 'new-sub2.jpg', { type: 'image/jpeg' })
            newSubFile2.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0))

            formData.append('subImages', newSubFile1)
            formData.append('subImages', newSubFile2)

            // 削除対象の指定 (URLで指定する想定)
            formData.append('deleteImageUrls', '/uploads/sub1.jpg')

            await updateWork('1', formData)

            // prisma.work.update が呼ばれ、適切なトランザクションが実行されることを期待
            expect(prismaMock.work.update).toHaveBeenCalled()
            // 削除対象の画像レコードが削除されることを期待
            expect(prismaMock.image.deleteMany).toHaveBeenCalledWith({
                where: {
                    url: { in: ['/uploads/sub1.jpg'] },
                    workId: '1'
                }
            })
            // 2枚の画像が保存されることを期待
            expect(prismaMock.image.create).toHaveBeenCalledTimes(2)
        })
    })

    describe('getTags', () => {
        it('returns all unique tag names', async () => {
            const mockTags = [
                { id: '1', name: 'TagA' },
                { id: '2', name: 'TagB' }
            ]
            // @ts-ignore - getTags may not exist yet in the imported module
            const { getTags } = await import('./work')
            prismaMock.tag.findMany.mockResolvedValue(mockTags)

            const tags = await getTags()

            expect(tags).toEqual(['TagA', 'TagB'])
            expect(prismaMock.tag.findMany).toHaveBeenCalledWith({
                orderBy: { name: 'asc' }
            })
        })
    })
})
