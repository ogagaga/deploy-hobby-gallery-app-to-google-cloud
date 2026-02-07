import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WorkForm } from './work-form'
import { createWork, updateWork } from '@/app/actions/work'

// Mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
    }),
}))

vi.mock('@/app/actions/work', () => ({
    createWork: vi.fn(),
    updateWork: vi.fn(),
    getTags: vi.fn().mockResolvedValue([]),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe('WorkForm - Multiple Sub-images', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('manages multiple sub-images correctly (add, remove, and submit)', async () => {
        const mockCreateWork = vi.mocked(createWork)
        mockCreateWork.mockResolvedValue({ success: true })

        render(<WorkForm />)

        const titleInput = screen.getByLabelText(/作品名/)
        const mainImageInput = screen.getByLabelText(/メイン写真/)
        const subImagesInput = screen.getByLabelText(/サブ写真/)
        const submitButton = screen.getByRole('button', { name: /作品を投稿する/ })

        // 1. 基本情報の入力
        fireEvent.change(titleInput, { target: { value: 'Test Work' } })

        // 2. メイン写真の選択
        const mainFile = new File(['main'], 'main.jpg', { type: 'image/jpeg' })
        fireEvent.change(mainImageInput, { target: { files: [mainFile] } })

        // 3. サブ写真1の選択
        const subFile1 = new File(['sub1'], 'sub1.jpg', { type: 'image/jpeg' })
        fireEvent.change(subImagesInput, { target: { files: [subFile1] } })

        // 4. サブ写真2の選択 (追記されるはず)
        const subFile2 = new File(['sub2'], 'sub2.jpg', { type: 'image/jpeg' })
        fireEvent.change(subImagesInput, { target: { files: [subFile2] } })

        // プレビューが表示されるのを待機 (FileReaderの非同期処理)
        await waitFor(() => {
            const previews = screen.getAllByAltText('Sub preview')
            expect(previews).toHaveLength(2)
        })

        // 5. 最初のサブ写真を削除
        const deleteButtons = screen.getAllByRole('button', { name: '削除' })
        fireEvent.click(deleteButtons[0])

        // プレビューが1つ減ることを確認
        await waitFor(() => {
            const previews = screen.getAllByAltText('Sub preview')
            expect(previews).toHaveLength(1)
        })

        // 6. 送信
        const form = submitButton.closest('form')!
        fireEvent.submit(form)

        await waitFor(() => {
            expect(mockCreateWork).toHaveBeenCalled()
            const calledFormData = mockCreateWork.mock.calls[0][0] as FormData

            // サブ写真の検証
            const subImages = calledFormData.getAll('subImages')
            expect(subImages).toHaveLength(1)
            expect((subImages[0] as File).name).toBe('sub2.jpg')
        }, { timeout: 3000 })
    })

    it('populates existing sub-images and handles deletions in edit mode', async () => {
        const mockUpdateWork = vi.mocked(updateWork)
        mockUpdateWork.mockResolvedValue({ success: true, id: '1' })

        const initialData = {
            id: '1',
            title: 'Initial Title',
            kitName: 'Kit',
            maker: 'Maker',
            scale: '1/100',
            genre: 'Mecha',
            paints: 'Paints',
            description: 'Desc',
            mainImage: '/old-main.jpg',
            tags: [],
            images: [
                { id: 'img1', url: '/old-sub1.jpg' },
                { id: 'img2', url: '/old-sub2.jpg' },
            ]
        }

        render(<WorkForm initialData={initialData} />)

        // 既存のサブ写真が表示されているか
        await waitFor(() => {
            const existingImages = screen.getAllByAltText('Sub image')
            expect(existingImages).toHaveLength(2)
        })

        // １つ削除
        const deleteButtons = screen.getAllByRole('button', { name: '削除' })
        fireEvent.click(deleteButtons[0])

        const submitButton = screen.getByRole('button', { name: /作品を更新する/ })
        const form = submitButton.closest('form')!
        fireEvent.submit(form)

        await waitFor(() => {
            expect(mockUpdateWork).toHaveBeenCalled()
            const calledFormData = mockUpdateWork.mock.calls[0][1] as FormData

            // 削除対象のURLが含まれているか
            const deleteUrls = calledFormData.getAll('deleteImageUrls')
            expect(deleteUrls).toContain('/old-sub1.jpg')
            expect(deleteUrls).not.toContain('/old-sub2.jpg')
        }, { timeout: 3000 })
    })
})
