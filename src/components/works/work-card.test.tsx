import { render, screen } from '@testing-library/react'
import { WorkCard } from './work-card'
import { describe, it, expect, vi } from 'vitest'

// モックの設定
vi.mock('@/components/ui/optimized-image', () => ({
    OptimizedImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

// framer-motion の簡略化
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (_target, property) => {
            return ({ children, ...props }: any) => {
                const Tag = property as any;
                return <Tag {...props}>{children}</Tag>;
            };
        }
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: (v: any) => v,
}))

const mockWork = {
    id: 'test-id',
    title: 'Test Work',
    kitName: 'Test Kit',
    maker: 'Test Maker',
    genre: 'Test Genre',
    mainImage: '/test-image.jpg',
    tags: [{ name: 'Tag1' }, { name: 'Tag2' }]
}

describe('WorkCard', () => {
    it('renders work information correctly', () => {
        render(<WorkCard work={mockWork} />)

        expect(screen.getByText('Test Work')).toBeInTheDocument()
        expect(screen.getByText(/Test Kit/)).toBeInTheDocument()
        expect(screen.getByText(/Test Maker/)).toBeInTheDocument()
        expect(screen.getByText('Test Genre')).toBeInTheDocument()
        expect(screen.getByText('Tag1')).toBeInTheDocument()
        expect(screen.getByText('Tag2')).toBeInTheDocument()
    })

    it('has a link to the work details page', () => {
        render(<WorkCard work={mockWork} />)
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/works/test-id')
    })

    it('renders image with correct alt text', () => {
        render(<WorkCard work={mockWork} />)
        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('alt', 'Test Work')
        expect(img).toHaveAttribute('src', '/test-image.jpg')
    })
})
