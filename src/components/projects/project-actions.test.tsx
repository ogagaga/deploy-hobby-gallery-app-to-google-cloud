/* eslint-disable react/display-name */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectActions } from './project-actions'

// モック
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

const mockDeleteProject = vi.fn()
vi.mock('@/app/actions/project', () => ({
    deleteProject: (...args: unknown[]) => mockDeleteProject(...args),
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

describe('ProjectActions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('編集リンクが正しいURLに向く', () => {
        render(<ProjectActions id="project-1" />)
        const editLink = screen.getByRole('link', { name: /編集/ })
        expect(editLink).toHaveAttribute('href', '/projects/project-1/edit')
    })

    it('削除ボタンが表示される', () => {
        render(<ProjectActions id="project-1" />)
        expect(screen.getByRole('button', { name: /削除/ })).toBeInTheDocument()
    })

    it('削除ボタンクリックで確認ダイアログが表示される', async () => {
        const user = userEvent.setup()
        render(<ProjectActions id="project-1" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))

        expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument()
        expect(screen.getByText(/所属する作品は削除されず/)).toBeInTheDocument()
    })

    it('削除成功時にトーストとリダイレクトが実行される', async () => {
        const { toast } = await import('sonner')
        mockDeleteProject.mockResolvedValue({ success: true })
        const user = userEvent.setup()
        render(<ProjectActions id="project-1" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))
        await user.click(screen.getByRole('button', { name: '削除する' }))

        expect(mockDeleteProject).toHaveBeenCalledWith('project-1')
        expect(toast.success).toHaveBeenCalledWith('シリーズを削除しました')
        expect(mockPush).toHaveBeenCalledWith('/projects')
    })

    it('削除失敗時（APIエラー）にエラートーストが表示される', async () => {
        const { toast } = await import('sonner')
        mockDeleteProject.mockResolvedValue({ success: false, error: '削除できません' })
        const user = userEvent.setup()
        render(<ProjectActions id="project-1" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))
        await user.click(screen.getByRole('button', { name: '削除する' }))

        expect(toast.error).toHaveBeenCalledWith('削除できません')
    })

    it('サーバーエラー時にエラートーストが表示される', async () => {
        const { toast } = await import('sonner')
        mockDeleteProject.mockRejectedValue(new Error('Network Error'))
        const user = userEvent.setup()
        render(<ProjectActions id="project-1" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))
        await user.click(screen.getByRole('button', { name: '削除する' }))

        expect(toast.error).toHaveBeenCalledWith('サーバーエラーが発生しました')
    })
})
