import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2')
            expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2')
        })

        it('handles tailwind conflicts', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8')
        })
    })
})
