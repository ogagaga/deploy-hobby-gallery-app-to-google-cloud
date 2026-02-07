import { render, screen, fireEvent } from '@testing-library/react'
import { Lightbox } from './lightbox'
import { describe, it, expect, vi } from 'vitest'

// framer-motion のモック (Proxyを使用してあらゆる要素に対応)
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (_target, property) => {
            return ({ children, ...props }: any) => {
                const Tag = property as any;
                // layoutId などのプロパティを DOM に流さないようにフィルタリング
                const { layoutId, whileHover, whileTap, initial, animate, exit, transition, drag, dragConstraints, dragElastic, onDragEnd, ...domProps } = props;
                return <Tag {...domProps}>{children}</Tag>;
            };
        }
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

const mockImages = ['/img1.jpg', '/img2.jpg', '/img3.jpg']

describe('Lightbox', () => {
    it('renders correctly when active', () => {
        const onClose = vi.fn()
        render(
            <Lightbox
                images={mockImages}
                currentIndex={0}
                onClose={onClose}
                title="Test Title"
                kitName="Test Kit"
            />
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Kit')).toBeInTheDocument()
        expect(screen.getByText('1 / 3')).toBeInTheDocument()
        expect(screen.getByRole('img')).toHaveAttribute('src', '/img1.jpg')
    })

    it('changes image on next/prev click', async () => {
        const onClose = vi.fn()
        render(<Lightbox images={mockImages} currentIndex={0} onClose={onClose} />)

        const nextBtn = screen.getByLabelText('次の画像へ')
        const prevBtn = screen.getByLabelText('前の画像へ')

        fireEvent.click(nextBtn)
        expect(await screen.findByText('2 / 3')).toBeInTheDocument()

        fireEvent.click(prevBtn)
        expect(await screen.findByText('1 / 3')).toBeInTheDocument()
    })

    it('closes when close button is clicked', () => {
        const onClose = vi.fn()
        render(<Lightbox images={mockImages} currentIndex={0} onClose={onClose} />)

        const closeBtn = screen.getByLabelText('閉じる')
        fireEvent.click(closeBtn)

        expect(onClose).toHaveBeenCalled()
    })

    it('handles keyboard navigation', async () => {
        const onClose = vi.fn()
        render(<Lightbox images={mockImages} currentIndex={0} onClose={onClose} />)

        fireEvent.keyDown(window, { key: 'ArrowRight' })
        expect(await screen.findByText('2 / 3')).toBeInTheDocument()

        fireEvent.keyDown(window, { key: 'ArrowLeft' })
        expect(await screen.findByText('1 / 3')).toBeInTheDocument()

        fireEvent.keyDown(window, { key: 'Escape' })
        expect(onClose).toHaveBeenCalled()
    })
})
