import { render, screen } from '@testing-library/react'
import { Header } from './header'
import { describe, it, expect, vi } from 'vitest'

// next/navigation のモック
vi.mock('next/navigation', () => ({
    usePathname: () => '/'
}))

// auth のモック
const mockAuth = vi.hoisted(() => vi.fn())
vi.mock('@/auth', () => ({
    auth: mockAuth
}))

// コンポーネント内のセッション取得をモック化
// 実際には Server Component か Client Component かでアプローチが異なるが、
// Header.tsx が async function (Server Component) の場合、auth() を直接呼んでいるはず
vi.mock('next-auth/react', () => ({
    useSession: vi.fn()
}))

describe('Header', () => {
    it('renders sign in button when not authenticated', async () => {
        mockAuth.mockResolvedValue(null)
        const HeaderComponent = await Header()
        render(HeaderComponent)

        expect(screen.getByText(/Googleでログイン/i)).toBeInTheDocument()
    })

    it('renders profile when authenticated', async () => {
        mockAuth.mockResolvedValue({
            user: { name: 'Test User', image: '/user.jpg' }
        })
        const HeaderComponent = await Header()
        render(HeaderComponent)

        expect(screen.getByText('Test User')).toBeInTheDocument()
        expect(screen.queryByText(/Googleでログイン/i)).not.toBeInTheDocument()
    })
})
