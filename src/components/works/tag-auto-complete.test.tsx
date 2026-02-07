import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TagAutoComplete } from './tag-auto-complete'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// getTags のモック
const mockGetTags = vi.hoisted(() => vi.fn())
vi.mock('@/app/actions/work', () => ({
    getTags: mockGetTags
}))

describe('TagAutoComplete', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetTags.mockResolvedValue(['Gundam', 'Gunpla', 'Zaku'])
    })

    it('renders with initial value', () => {
        render(<TagAutoComplete defaultValue="Tag1, Tag2" name="tags" />)
        const input = screen.getByRole('textbox') as HTMLInputElement
        expect(input.value).toBe('Tag1, Tag2')
    })

    it('shows suggestions when typing', async () => {
        mockGetTags.mockResolvedValue(['Gundam', 'Gunpla', 'Zaku'])
        render(<TagAutoComplete defaultValue="" name="tags" />)

        // getTags が呼ばれるまで待機
        await waitFor(() => expect(mockGetTags).toHaveBeenCalled())

        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'Gun' } })

        await waitFor(() => {
            expect(screen.getByText('Gundam')).toBeInTheDocument()
            expect(screen.getByText('Gunpla')).toBeInTheDocument()
        })
    })

    it('adds selected suggestion to the input', async () => {
        mockGetTags.mockResolvedValue(['Gundam', 'Gunpla', 'Zaku'])
        render(<TagAutoComplete defaultValue="Real, " name="tags" />)

        // getTags が呼ばれるまで待機
        await waitFor(() => expect(mockGetTags).toHaveBeenCalled())

        const input = screen.getByRole('textbox') as HTMLInputElement

        fireEvent.change(input, { target: { value: 'Real, Gun' } })

        const suggestion = await screen.findByText('Gundam')
        fireEvent.click(suggestion)

        expect(input.value).toBe('Real, Gundam, ')
    })
})
