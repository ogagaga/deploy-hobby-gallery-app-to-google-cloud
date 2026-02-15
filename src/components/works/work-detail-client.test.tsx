/* eslint-disable react/display-name */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkDetailClient } from './work-detail-client'

// モック: framer-motion（vi.mock はホイストされるため全てインラインで定義）
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
        motion: new Proxy(function () { } as unknown, handler),
        AnimatePresence: ({ children }: { children: unknown }) => children,
    }
})

// モック: next/image
vi.mock('next/image', () => ({
    default: (props: Record<string, unknown>) => {
        const { fill, priority, ...rest } = props
        return <img {...rest as object} />
    },
}))

// モック: use-image-colors
vi.mock('@/hooks/use-image-colors', () => ({
    useImageColors: () => ({
        colors: {
            vibrant: '#ff0000',
            lightVibrant: '#ff6666',
            darkVibrant: '#990000',
            muted: '#666666',
            lightMuted: '#999999',
            darkMuted: '#333333',
        },
    }),
}))

// モック: Lightbox
vi.mock('@/components/ui/lightbox', () => ({
    Lightbox: () => <div data-testid="lightbox" />,
}))

// モック: MarkdownRenderer
vi.mock('@/components/ui/markdown-renderer', () => ({
    MarkdownRenderer: ({ content }: { content: string }) => (
        <div data-testid="markdown-renderer">{content}</div>
    ),
}))

// モック: next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

// モック: delete-button
vi.mock('@/components/works/delete-button', () => ({
    DeleteButton: ({ workTitle }: { workTitle: string }) => (
        <button data-testid="delete-button">削除 {workTitle}</button>
    ),
}))

// モック: animations
vi.mock('@/components/animations/motion-wrapper', () => ({
    MotionContainer: ({ children, ...props }: Record<string, unknown>) => <div {...props as object}>{children as React.ReactNode}</div>,
    MotionItem: ({ children, ...props }: Record<string, unknown>) => <div {...props as object}>{children as React.ReactNode}</div>,
}))

// テスト用の作品データ
const createWork = (overrides = {}) => ({
    id: 'work-1',
    title: 'テスト作品',
    description: '作品の説明です',
    mainImage: '/uploads/main.jpg',
    genre: 'ガンプラ',
    kitName: 'RX-78-2 ガンダム',
    maker: 'バンダイ',
    scale: '1/144',
    paints: 'ラッカー系塗料',
    endDate: new Date('2025-01-15'),
    startDate: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    isPublic: true,
    projectId: null,
    sortOrder: 0,
    images: [],
    tags: [],
    ...overrides,
})

describe('WorkDetailClient', () => {
    it('作品タイトルが表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByText('テスト作品')).toBeInTheDocument()
    })

    it('ジャンルバッジが表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByText('ガンプラ')).toBeInTheDocument()
    })

    it('キット名とメーカーが表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByText(/RX-78-2 ガンダム/)).toBeInTheDocument()
        expect(screen.getByText(/バンダイ/)).toBeInTheDocument()
    })

    it('スケールが表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByText('1/144')).toBeInTheDocument()
    })

    it('完成日が表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        // 日本語ロケールで 2025/01/15 形式
        expect(screen.getByText('2025/01/15')).toBeInTheDocument()
    })

    it('塗料情報が表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByText('ラッカー系塗料')).toBeInTheDocument()
    })

    it('説明文が MarkdownRenderer で表示される', () => {
        render(<WorkDetailClient work={createWork()} isAdmin={false} />)
        expect(screen.getByTestId('markdown-renderer')).toHaveTextContent('作品の説明です')
    })

    it('タグが表示される', () => {
        const work = createWork({
            tags: [
                { id: 'tag-1', name: 'HG' },
                { id: 'tag-2', name: 'ウェザリング' },
            ],
        })
        render(<WorkDetailClient work={work} isAdmin={false} />)
        expect(screen.getByText('#HG')).toBeInTheDocument()
        expect(screen.getByText('#ウェザリング')).toBeInTheDocument()
    })

    it('サブ画像がある場合に表示される', () => {
        const work = createWork({
            images: [
                { id: 'img-1', url: '/uploads/sub1.jpg', sortOrder: 0, workId: 'work-1' },
                { id: 'img-2', url: '/uploads/sub2.jpg', sortOrder: 1, workId: 'work-1' },
            ],
        })
        render(<WorkDetailClient work={work} isAdmin={false} />)
        // メイン画像 + サブ画像2枚 = 3枚の img 要素
        const images = screen.getAllByRole('img')
        expect(images.length).toBe(3)
    })

    describe('管理者表示', () => {
        it('isAdmin=true の場合、編集・削除ボタンが表示される', () => {
            render(<WorkDetailClient work={createWork()} isAdmin={true} />)
            expect(screen.getByRole('link', { name: /編集/ })).toBeInTheDocument()
            expect(screen.getByTestId('delete-button')).toBeInTheDocument()
        })

        it('isAdmin=false の場合、編集・削除ボタンが表示されない', () => {
            render(<WorkDetailClient work={createWork()} isAdmin={false} />)
            expect(screen.queryByRole('link', { name: /編集/ })).not.toBeInTheDocument()
            expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument()
        })
    })

    describe('オプション項目の非表示', () => {
        it('endDate がない場合は完成日が表示されない', () => {
            const work = createWork({ endDate: null })
            render(<WorkDetailClient work={work} isAdmin={false} />)
            expect(screen.queryByText('COMPLETED')).not.toBeInTheDocument()
        })

        it('paints がない場合は塗料情報が表示されない', () => {
            const work = createWork({ paints: null })
            render(<WorkDetailClient work={work} isAdmin={false} />)
            expect(screen.queryByText('PAINTS')).not.toBeInTheDocument()
        })

        it('ジャンルがない場合はジャンルバッジが表示されない', () => {
            const work = createWork({ genre: null })
            render(<WorkDetailClient work={work} isAdmin={false} />)
            // 「ガンプラ」が表示されないことを確認
            expect(screen.queryByText('ガンプラ')).not.toBeInTheDocument()
        })

        it('説明がない場合はデフォルトテキストが表示される', () => {
            const work = createWork({ description: null })
            render(<WorkDetailClient work={work} isAdmin={false} />)
            expect(screen.getByTestId('markdown-renderer')).toHaveTextContent('説明はありません。')
        })
    })
})
