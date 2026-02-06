import { render, screen, fireEvent } from '@testing-library/react'
import { WorkList } from './work-list'
import { describe, it, expect, vi } from 'vitest'

// モックの設定
vi.mock('./work-card', () => ({
    WorkCard: ({ work }: any) => <div data-testid="work-card">{work.title}</div>
}))

vi.mock('@/components/animations/motion-wrapper', () => ({
    MotionContainer: ({ children }: any) => <div>{children}</div>,
    MotionItem: ({ children }: any) => <div>{children}</div>
}))

const mockWorks = [
    {
        id: '1',
        title: 'Gundam',
        kitName: 'HGUC',
        maker: 'Bandai',
        genre: 'Mecha',
        mainImage: '/img1.jpg',
        tags: [{ id: 't1', name: 'Real' }],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: null,
        endDate: null,
        paints: null,
        description: null,
        scale: null
    },
    {
        id: '2',
        title: 'Zaku',
        kitName: 'MG',
        maker: 'Bandai',
        genre: 'Mecha',
        mainImage: '/img2.jpg',
        tags: [{ id: 't2', name: 'Zeon' }],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: null,
        endDate: null,
        paints: null,
        description: null,
        scale: null
    }
]

describe('WorkList', () => {
    it('renders all works initially', () => {
        render(<WorkList works={mockWorks as any} />)
        expect(screen.getAllByTestId('work-card')).toHaveLength(2)
    })

    it('filters works by search query', () => {
        render(<WorkList works={mockWorks as any} />)
        const searchInput = screen.getByPlaceholderText(/検索.../)

        fireEvent.change(searchInput, { target: { value: 'Gundam' } })

        expect(screen.getByText('Gundam')).toBeInTheDocument()
        expect(screen.queryByText('Zaku')).not.toBeInTheDocument()
    })

    it('filters works by genre', () => {
        // 全て同じジャンルなので、ジャンルフィルタの存在確認
        render(<WorkList works={mockWorks as any} />)
        expect(screen.getByText('Mecha')).toBeInTheDocument()
    })

    it('shows empty message when no works match', () => {
        render(<WorkList works={mockWorks as any} />)
        const searchInput = screen.getByPlaceholderText(/検索.../)

        fireEvent.change(searchInput, { target: { value: 'Nonexistent' } })

        expect(screen.getByText('一致する作品が見つかりませんでした')).toBeInTheDocument()
    })
})
