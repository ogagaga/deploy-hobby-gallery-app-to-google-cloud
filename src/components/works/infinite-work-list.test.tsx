import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InfiniteWorkList } from './infinite-work-list'

// --- モック ---

// framer-motion（vi.mock はホイストされるため全てインラインで定義）
vi.mock('framer-motion', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react')
    // eslint-disable-next-line react/display-name
    const createComponent = (tag: string) => ({ children, ...props }: Record<string, unknown>) => {
        const { whileHover, whileTap, whileInView, initial, animate, exit, variants, transition, layout, layoutId, ...rest } = props
        void whileHover; void whileTap; void whileInView; void initial; void animate; void exit; void variants; void transition; void layout; void layoutId
        return React.createElement(tag, rest, children)
    }
    return {
        motion: new Proxy({}, { get: (_t: unknown, prop: string) => createComponent(prop) }),
        AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    }
})

// MotionWrapper（アニメーション無効化）
vi.mock('@/components/animations/motion-wrapper', () => ({
    MotionContainer: ({ children, className }: { children: React.ReactNode, className?: string }) =>
        <div className={className}>{children}</div>,
    MotionItem: ({ children, className }: { children: React.ReactNode, className?: string }) =>
        <div className={className}>{children}</div>,
}))

// WorkCard（軽量モック）
vi.mock('./work-card', () => ({
    WorkCard: ({ work }: { work: { title: string, id: string } }) =>
        <div data-testid={`work-card-${work.id}`}>{work.title}</div>,
}))

// react-intersection-observer
const mockInView = vi.fn(() => false)
vi.mock('react-intersection-observer', () => ({
    useInView: () => ({
        ref: vi.fn(),
        inView: mockInView(),
    }),
}))

// getWorks（Server Action）
const mockGetWorks = vi.fn()
vi.mock('@/app/actions/work', () => ({
    getWorks: (...args: unknown[]) => mockGetWorks(...args),
}))

// next/image
vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string, alt: string }) => <img src={src} alt={alt} />,
}))

// --- テストデータ ---

/** テスト用作品データを生成 */
function createMockWork(overrides: Partial<{
    id: string
    title: string
    genre: string | null
    kitName: string | null
    tags: { id: string, name: string }[]
}> = {}) {
    return {
        id: overrides.id || 'work-1',
        title: overrides.title || 'テスト作品',
        description: 'テスト説明',
        mainImage: '/test.jpg',
        genre: overrides.genre !== undefined ? overrides.genre : 'ガンプラ',
        kitName: overrides.kitName !== undefined ? overrides.kitName : 'MG ガンダム',
        maker: 'バンダイ',
        scale: '1/100',
        endDate: null,
        paints: null,
        projectId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: overrides.tags || [{ id: 'tag-1', name: 'ウェザリング' }],
        images: [{ id: 'img-1' }],
        project: null,
    }
}

const work1 = createMockWork({
    id: 'work-1',
    title: 'RX-78-2 ガンダム',
    genre: 'ガンプラ',
    kitName: 'MG ガンダム Ver.Ka',
    tags: [{ id: 'tag-1', name: 'ウェザリング' }],
})

const work2 = createMockWork({
    id: 'work-2',
    title: 'タイガーI',
    genre: 'AFV',
    kitName: 'タミヤ タイガー',
    tags: [{ id: 'tag-2', name: '筆塗り' }],
})

const work3 = createMockWork({
    id: 'work-3',
    title: 'ザク II',
    genre: 'ガンプラ',
    kitName: 'HG ザク',
    tags: [{ id: 'tag-3', name: 'スミ入れ' }],
})

describe('InfiniteWorkList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockInView.mockReturnValue(false)
    })

    // --- 初期表示 ---

    it('初期作品が表示される', () => {
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2]}
                initialHasMore={false}
                initialTotal={2}
            />
        )

        expect(screen.getByText('RX-78-2 ガンダム')).toBeInTheDocument()
        expect(screen.getByText('タイガーI')).toBeInTheDocument()
    })

    it('ジャンルバッジが重複なく表示される', () => {
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2, work3]}
                initialHasMore={false}
                initialTotal={3}
            />
        )

        // 「すべて」+ ジャンル2種（ガンプラ, AFV）
        expect(screen.getByText('すべて')).toBeInTheDocument()
        expect(screen.getByText('ガンプラ')).toBeInTheDocument()
        expect(screen.getByText('AFV')).toBeInTheDocument()
    })

    // --- 検索フィルタ ---

    it('タイトルで検索フィルタリングできる', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2]}
                initialHasMore={false}
                initialTotal={2}
            />
        )

        const searchInput = screen.getByPlaceholderText('タイトル、タグ、キット名で検索...')
        await user.type(searchInput, 'ガンダム')

        expect(screen.getByText('RX-78-2 ガンダム')).toBeInTheDocument()
        expect(screen.queryByText('タイガーI')).not.toBeInTheDocument()
    })

    it('タグ名で検索フィルタリングできる', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2]}
                initialHasMore={false}
                initialTotal={2}
            />
        )

        const searchInput = screen.getByPlaceholderText('タイトル、タグ、キット名で検索...')
        await user.type(searchInput, '筆塗り')

        expect(screen.queryByText('RX-78-2 ガンダム')).not.toBeInTheDocument()
        expect(screen.getByText('タイガーI')).toBeInTheDocument()
    })

    it('キット名で検索フィルタリングできる', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2]}
                initialHasMore={false}
                initialTotal={2}
            />
        )

        const searchInput = screen.getByPlaceholderText('タイトル、タグ、キット名で検索...')
        await user.type(searchInput, 'タミヤ')

        expect(screen.queryByText('RX-78-2 ガンダム')).not.toBeInTheDocument()
        expect(screen.getByText('タイガーI')).toBeInTheDocument()
    })

    it('検索結果が0件の場合「一致する作品が見つかりませんでした」が表示される', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1]}
                initialHasMore={false}
                initialTotal={1}
            />
        )

        const searchInput = screen.getByPlaceholderText('タイトル、タグ、キット名で検索...')
        await user.type(searchInput, '存在しない作品名')

        expect(screen.getByText('一致する作品が見つかりませんでした')).toBeInTheDocument()
    })

    // --- ジャンルフィルタ ---

    it('ジャンルバッジをクリックするとフィルタリングされる', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2, work3]}
                initialHasMore={false}
                initialTotal={3}
            />
        )

        // 「AFV」をクリック
        await user.click(screen.getByText('AFV'))

        expect(screen.queryByText('RX-78-2 ガンダム')).not.toBeInTheDocument()
        expect(screen.getByText('タイガーI')).toBeInTheDocument()
        expect(screen.queryByText('ザク II')).not.toBeInTheDocument()
    })

    it('「すべて」をクリックするとフィルタが解除される', async () => {
        const user = userEvent.setup()
        render(
            <InfiniteWorkList
                initialWorks={[work1, work2]}
                initialHasMore={false}
                initialTotal={2}
            />
        )

        // まず「AFV」でフィルタ → 「すべて」で解除
        await user.click(screen.getByText('AFV'))
        expect(screen.queryByText('RX-78-2 ガンダム')).not.toBeInTheDocument()

        await user.click(screen.getByText('すべて'))
        expect(screen.getByText('RX-78-2 ガンダム')).toBeInTheDocument()
        expect(screen.getByText('タイガーI')).toBeInTheDocument()
    })

    // --- 無限スクロール ---

    it('全件表示済みの場合「End of Collection」が表示される', () => {
        render(
            <InfiniteWorkList
                initialWorks={[work1]}
                initialHasMore={false}
                initialTotal={1}
            />
        )

        expect(screen.getByText('— End of Collection —')).toBeInTheDocument()
    })

    it('追加データがある場合、スクロールトリガーが表示される', () => {
        render(
            <InfiniteWorkList
                initialWorks={[work1]}
                initialHasMore={true}
                initialTotal={10}
            />
        )

        // hasMore=true 時は "End of Collection" は表示されない
        expect(screen.queryByText('— End of Collection —')).not.toBeInTheDocument()
    })

    it('スクロール検知時に追加データを読み込む', async () => {
        const newWork = createMockWork({
            id: 'work-new',
            title: '新しい作品',
            genre: 'ガンプラ',
        })

        mockGetWorks.mockResolvedValue({
            success: true,
            works: [newWork],
            hasMore: false,
        })

        mockInView.mockReturnValue(true)

        render(
            <InfiniteWorkList
                initialWorks={[work1]}
                initialHasMore={true}
                initialTotal={10}
            />
        )

        await waitFor(() => {
            expect(mockGetWorks).toHaveBeenCalledWith(2, 8)
        })

        await waitFor(() => {
            expect(screen.getByText('新しい作品')).toBeInTheDocument()
        })
    })
})
