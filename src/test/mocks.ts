import { vi } from 'vitest'

// Prisma Mock
export const prismaMock = {
    work: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
    },
    image: {
        deleteMany: vi.fn(),
    },
    tag: {
        findMany: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prismaMock)),
}

vi.mock('@/lib/prisma', () => ({
    prisma: prismaMock,
}))

// Auth Mock
export const authMock = vi.fn()
vi.mock('@/auth', () => ({
    auth: authMock,
}))

// GCS / FS Mock
vi.mock('@google-cloud/storage', () => ({
    Storage: class {
        bucket = vi.fn(() => ({
            file: vi.fn(() => ({
                save: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(undefined),
            })),
        }))
    }
}))

// fs/promises mock with default export support
export const writeFile = vi.fn().mockResolvedValue(undefined)
export const mkdir = vi.fn().mockResolvedValue(undefined)
export const unlink = vi.fn().mockResolvedValue(undefined)

vi.mock('fs/promises', () => ({
    writeFile,
    mkdir,
    unlink,
    default: {
        writeFile,
        mkdir,
        unlink,
    }
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))
