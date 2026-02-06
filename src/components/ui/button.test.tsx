import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'
import { describe, it, expect, vi } from 'vitest'

describe('Button', () => {
    it('renders correctly with children', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        fireEvent.click(screen.getByRole('button', { name: /click me/i }))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies the correct classes for variants', () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>)
        let button = screen.getByRole('button', { name: /delete/i })
        expect(button).toHaveAttribute('data-variant', 'destructive')

        rerender(<Button variant="outline">Outline</Button>)
        button = screen.getByRole('button', { name: /outline/i })
        expect(button).toHaveAttribute('data-variant', 'outline')
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
    })
})
