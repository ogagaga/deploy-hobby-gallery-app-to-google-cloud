/* eslint-disable react/display-name */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from './project-form'

// モック
const mockPush = vi.fn()
const mockBack = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, back: mockBack }),
}))

const mockCreateProject = vi.fn()
const mockUpdateProject = vi.fn()
vi.mock('@/app/actions/project', () => ({
    createProject: (...args: unknown[]) => mockCreateProject(...args),
    updateProject: (...args: unknown[]) => mockUpdateProject(...args),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

// framer-motion モック（vi.mock はホイストされるため全てインラインで定義）
vi.mock('framer-motion', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react')
    const createComponent = (tag: string) => ({ children, ...props }: Record<string, unknown>) => {
        const { whileHover, whileTap, whileInView, initial, animate, exit, variants, transition, layout, layoutId, ...rest } = props
        return React.createElement(tag, rest, children)
    }
    const handler = {
        get: (_t: unknown, prop: string) => createComponent(prop),
        apply: (_t: unknown, _thisArg: unknown, _args: unknown[]) => createComponent('div'),
    }
    return {
        motion: new Proxy(function () { }, handler),
        AnimatePresence: ({ children }: { children: unknown }) => children,
    }
})

describe('ProjectForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('新規作成モード', () => {
        it('フォームフィールドが表示される', () => {
            render(<ProjectForm />)

            expect(screen.getByLabelText('シリーズ名')).toBeInTheDocument()
            expect(screen.getByLabelText('シリーズの説明')).toBeInTheDocument()
            expect(screen.getByLabelText('カバー画像')).toBeInTheDocument()
        })

        it('「作成する」ボタンが表示される', () => {
            render(<ProjectForm />)
            expect(screen.getByRole('button', { name: /作成する/ })).toBeInTheDocument()
        })

        it('「キャンセル」ボタンで router.back() が呼ばれる', async () => {
            const user = userEvent.setup()
            render(<ProjectForm />)

            await user.click(screen.getByRole('button', { name: 'キャンセル' }))

            expect(mockBack).toHaveBeenCalled()
        })
    })

    describe('編集モード', () => {
        const initialData = {
            id: 'project-1',
            name: 'テストシリーズ',
            description: 'シリーズの説明文',
            mainImage: '/uploads/test.jpg',
        }

        it('初期値が入力欄に表示される', () => {
            render(<ProjectForm initialData={initialData} />)

            expect(screen.getByLabelText('シリーズ名')).toHaveValue('テストシリーズ')
            expect(screen.getByLabelText('シリーズの説明')).toHaveValue('シリーズの説明文')
        })

        it('「更新する」ボタンが表示される', () => {
            render(<ProjectForm initialData={initialData} />)
            expect(screen.getByRole('button', { name: /更新する/ })).toBeInTheDocument()
        })

        it('プレビュー画像が表示される', () => {
            render(<ProjectForm initialData={initialData} />)
            const preview = screen.getByAltText('Preview')
            expect(preview).toHaveAttribute('src', '/uploads/test.jpg')
        })
    })

    describe('フォーム送信', () => {
        it('新規作成成功時にリダイレクトされる', async () => {
            const { toast } = await import('sonner')
            mockCreateProject.mockResolvedValue({ success: true, id: 'new-id' })
            const user = userEvent.setup()
            render(<ProjectForm />)

            await user.type(screen.getByLabelText('シリーズ名'), 'テスト')
            await user.click(screen.getByRole('button', { name: /作成する/ }))

            expect(mockCreateProject).toHaveBeenCalled()
            expect(toast.success).toHaveBeenCalledWith('シリーズを作成しました')
            expect(mockPush).toHaveBeenCalledWith('/projects/new-id')
        })

        it('バリデーションエラー時にエラーが表示される', async () => {
            const { toast } = await import('sonner')
            mockCreateProject.mockResolvedValue({
                success: false,
                error: '入力エラー',
                details: { name: ['シリーズ名は必須です'] },
            })
            const user = userEvent.setup()
            render(<ProjectForm />)

            await user.click(screen.getByRole('button', { name: /作成する/ }))

            expect(toast.error).toHaveBeenCalledWith('入力エラー')
            expect(screen.getByText('シリーズ名は必須です')).toBeInTheDocument()
        })
    })
})
