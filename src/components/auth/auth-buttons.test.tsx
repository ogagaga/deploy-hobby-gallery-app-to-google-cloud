import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInButton, SignOutButton } from './auth-buttons'

// next-auth/react のモック
const signIn = vi.fn()
const signOut = vi.fn()
vi.mock('next-auth/react', () => ({
    signIn: (...args: unknown[]) => signIn(...args),
    signOut: (...args: unknown[]) => signOut(...args),
}))

describe('AuthButtons', () => {
    describe('SignInButton', () => {
        it('「Googleでログイン」ボタンが表示される', () => {
            render(<SignInButton />)
            expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeInTheDocument()
        })

        it('クリックで signIn("google") が呼ばれる', async () => {
            const user = userEvent.setup()
            render(<SignInButton />)

            await user.click(screen.getByRole('button', { name: 'Googleでログイン' }))

            expect(signIn).toHaveBeenCalledWith('google')
        })
    })

    describe('SignOutButton', () => {
        it('「ログアウト」ボタンが表示される', () => {
            render(<SignOutButton />)
            expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument()
        })

        it('クリックで signOut() が呼ばれる', async () => {
            const user = userEvent.setup()
            render(<SignOutButton />)

            await user.click(screen.getByRole('button', { name: 'ログアウト' }))

            expect(signOut).toHaveBeenCalled()
        })
    })
})
