/* eslint-disable react/display-name */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteButton } from './delete-button'

// モック
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

const mockDeleteWork = vi.fn()
vi.mock('@/app/actions/work', () => ({
    deleteWork: (...args: unknown[]) => mockDeleteWork(...args),
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

describe('DeleteButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('削除ボタンが表示される', () => {
        render(<DeleteButton workId="work-1" workTitle="テスト作品" />)
        expect(screen.getByRole('button', { name: /削除/ })).toBeInTheDocument()
    })

    it('クリックで確認ダイアログが表示される', async () => {
        const user = userEvent.setup()
        render(<DeleteButton workId="work-1" workTitle="テスト作品" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))

        expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument()
    })

    it('ダイアログに作品名が含まれる', async () => {
        const user = userEvent.setup()
        render(<DeleteButton workId="work-1" workTitle="テスト作品" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))

        expect(screen.getByText(/テスト作品/)).toBeInTheDocument()
    })

    it('削除成功時にトーストとリダイレクトが実行される', async () => {
        const { toast } = await import('sonner')
        mockDeleteWork.mockResolvedValue({ success: true })
        const user = userEvent.setup()
        render(<DeleteButton workId="work-1" workTitle="テスト作品" />)

        // ダイアログを開く
        await user.click(screen.getByRole('button', { name: /削除/ }))
        // 「作品を削除する」をクリック
        await user.click(screen.getByRole('button', { name: '作品を削除する' }))

        expect(mockDeleteWork).toHaveBeenCalledWith('work-1')
        expect(toast.success).toHaveBeenCalledWith('作品を削除しました')
        expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('削除失敗時にエラートーストが表示される', async () => {
        const { toast } = await import('sonner')
        mockDeleteWork.mockRejectedValue(new Error('削除エラー'))
        const user = userEvent.setup()
        render(<DeleteButton workId="work-1" workTitle="テスト作品" />)

        await user.click(screen.getByRole('button', { name: /削除/ }))
        await user.click(screen.getByRole('button', { name: '作品を削除する' }))

        expect(toast.error).toHaveBeenCalledWith('削除に失敗しました')
    })
})
