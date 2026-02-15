import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock, authMock } from '@/test/mocks'

// テスト対象
import { getProjects, createProject, updateProject, deleteProject } from './project'

// saveImage / deleteImage のモック
vi.mock('@/lib/storage', () => ({
    saveImage: vi.fn().mockResolvedValue('/mocked-project-image.jpg'),
    deleteImage: vi.fn().mockResolvedValue(undefined),
}))

import { saveImage, deleteImage } from '@/lib/storage'

// 管理者メールアドレス（checkAdmin で使用）
const ADMIN_EMAIL = 'admin@example.com'

describe('Project Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.ADMIN_EMAIL = ADMIN_EMAIL
    })

    // 管理者セッションのヘルパー
    const adminSession = {
        user: { email: ADMIN_EMAIL },
        expires: '',
    }

    // --- getProjects ---
    describe('getProjects', () => {
        it('プロジェクト一覧を取得する', async () => {
            const mockProjects = [
                { id: '1', name: 'Series A', _count: { works: 3 } },
                { id: '2', name: 'Series B', _count: { works: 1 } },
            ]
            prismaMock.project.findMany.mockResolvedValue(mockProjects)

            const result = await getProjects()

            expect(result).toEqual(mockProjects)
            expect(prismaMock.project.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { works: true } } },
            })
        })

        it('エラー時は空配列を返す', async () => {
            prismaMock.project.findMany.mockRejectedValue(new Error('DB Error'))

            const result = await getProjects()

            expect(result).toEqual([])
        })
    })

    // --- createProject ---
    describe('createProject', () => {
        it('未認証の場合はエラーを返す', async () => {
            authMock.mockResolvedValue(null)

            const formData = new FormData()
            formData.append('name', 'テストシリーズ')
            formData.append('description', '')

            const result = await createProject(formData)

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
        })

        it('管理者でない場合はエラーを返す', async () => {
            authMock.mockResolvedValue({
                user: { email: 'user@example.com' },
                expires: '',
            })

            const formData = new FormData()
            formData.append('name', 'テストシリーズ')
            formData.append('description', '')

            const result = await createProject(formData)

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
        })

        it('バリデーションエラーの場合はエラー詳細を返す', async () => {
            authMock.mockResolvedValue(adminSession)

            const formData = new FormData()
            formData.append('name', '') // 名前が空
            formData.append('description', '')

            const result = await createProject(formData)

            expect(result.success).toBe(false)
            expect(result.error).toBe('入力内容に不備があります。')
        })

        it('画像なしでプロジェクトを作成する', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.create.mockResolvedValue({ id: 'new-id', name: 'テストシリーズ' })

            const formData = new FormData()
            formData.append('name', 'テストシリーズ')
            formData.append('description', 'テスト説明')

            const result = await createProject(formData)

            expect(result).toEqual({ success: true, id: 'new-id' })
            expect(prismaMock.project.create).toHaveBeenCalledWith({
                data: {
                    name: 'テストシリーズ',
                    description: 'テスト説明',
                    mainImage: null,
                },
            })
            expect(saveImage).not.toHaveBeenCalled()
        })

        it('画像ありでプロジェクトを作成する', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.create.mockResolvedValue({ id: 'new-id', name: 'テストシリーズ' })

            const formData = new FormData()
            formData.append('name', 'テストシリーズ')
            formData.append('description', '')
            formData.append('mainImage', new File(['img'], 'photo.jpg', { type: 'image/jpeg' }))

            const result = await createProject(formData)

            expect(result).toEqual({ success: true, id: 'new-id' })
            expect(saveImage).toHaveBeenCalled()
            expect(prismaMock.project.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    mainImage: '/mocked-project-image.jpg',
                }),
            })
        })
    })

    // --- updateProject ---
    describe('updateProject', () => {
        it('存在しないプロジェクトはエラーを返す', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.findUnique.mockResolvedValue(null)

            const formData = new FormData()
            formData.append('name', 'テスト')
            formData.append('description', '')

            const result = await updateProject('nonexistent-id', formData)

            expect(result).toEqual({ success: false, error: 'シリーズが見つかりません。' })
        })

        it('プロジェクトを正常に更新する（画像変更なし）', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.findUnique.mockResolvedValue({
                id: 'proj-1',
                name: '古い名前',
                mainImage: '/old-image.jpg',
            })
            prismaMock.project.update.mockResolvedValue({
                id: 'proj-1',
                name: '新しい名前',
            })

            const formData = new FormData()
            formData.append('name', '新しい名前')
            formData.append('description', '更新された説明')

            const result = await updateProject('proj-1', formData)

            expect(result).toEqual({ success: true, id: 'proj-1' })
            expect(saveImage).not.toHaveBeenCalled()
            expect(deleteImage).not.toHaveBeenCalled()
        })

        it('プロジェクトの画像を差し替える', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.findUnique.mockResolvedValue({
                id: 'proj-1',
                name: 'テスト',
                mainImage: '/old-image.jpg',
            })
            prismaMock.project.update.mockResolvedValue({
                id: 'proj-1',
                name: 'テスト',
            })

            const formData = new FormData()
            formData.append('name', 'テスト')
            formData.append('description', '')
            formData.append('mainImage', new File(['new-img'], 'new.jpg', { type: 'image/jpeg' }))

            const result = await updateProject('proj-1', formData)

            expect(result).toEqual({ success: true, id: 'proj-1' })
            expect(deleteImage).toHaveBeenCalledWith('/old-image.jpg')
            expect(saveImage).toHaveBeenCalled()
        })
    })

    // --- deleteProject ---
    describe('deleteProject', () => {
        it('プロジェクトを正常に削除する', async () => {
            authMock.mockResolvedValue(adminSession)
            prismaMock.project.delete.mockResolvedValue({ id: 'proj-1' })

            const result = await deleteProject('proj-1')

            expect(result).toEqual({ success: true })
            expect(prismaMock.project.delete).toHaveBeenCalledWith({
                where: { id: 'proj-1' },
            })
        })

        it('未認証の場合はエラーを返す', async () => {
            authMock.mockResolvedValue(null)

            const result = await deleteProject('proj-1')

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
        })
    })
})
