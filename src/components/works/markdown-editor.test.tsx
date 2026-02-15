import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MarkdownEditor } from './markdown-editor'

// MarkdownRenderer モック
vi.mock('@/components/ui/markdown-renderer', () => ({
    MarkdownRenderer: ({ content }: { content: string }) => (
        <div data-testid="markdown-preview">{content}</div>
    ),
}))

describe('MarkdownEditor', () => {
    it('編集タブにテキストエリアが表示される', () => {
        const onChange = vi.fn()
        render(<MarkdownEditor value="" onChange={onChange} />)

        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('初期値が表示される', () => {
        const onChange = vi.fn()
        render(<MarkdownEditor value="テスト内容" onChange={onChange} />)

        expect(screen.getByRole('textbox')).toHaveValue('テスト内容')
    })

    it('テキスト変更時に onChange が呼ばれる', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()
        render(<MarkdownEditor value="" onChange={onChange} />)

        await user.type(screen.getByRole('textbox'), 'a')

        expect(onChange).toHaveBeenCalledWith('a')
    })

    it('プレビュータブで Markdown がレンダリングされる', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()
        render(<MarkdownEditor value="**太字**テスト" onChange={onChange} />)

        // プレビュータブをクリック
        await user.click(screen.getByRole('tab', { name: /プレビュー/ }))

        expect(screen.getByTestId('markdown-preview')).toHaveTextContent('**太字**テスト')
    })

    it('空の場合はプレビューに案内文が表示される', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()
        render(<MarkdownEditor value="" onChange={onChange} />)

        await user.click(screen.getByRole('tab', { name: /プレビュー/ }))

        expect(screen.getByText('プレビューする内容がありません。')).toBeInTheDocument()
    })

    it('name 属性が設定される', () => {
        const onChange = vi.fn()
        render(<MarkdownEditor value="" onChange={onChange} name="description" />)

        expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description')
    })

    it('Markdown Supported のラベルが表示される', () => {
        const onChange = vi.fn()
        render(<MarkdownEditor value="" onChange={onChange} />)

        expect(screen.getByText('Markdown Supported')).toBeInTheDocument()
    })
})
