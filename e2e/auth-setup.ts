import { test as base, type Page } from '@playwright/test'
import { encode } from 'next-auth/jwt'
import * as dotenv from 'dotenv'
import * as path from 'path'

// .env.local を読み込む（dev サーバーと同じ AUTH_SECRET を使うため）
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

/**
 * 管理者セッション Cookie を設定するヘルパー
 *
 * NextAuth v5 の JWT セッショントークンを直接生成し、
 * ブラウザの Cookie に設定することで認証をバイパスする。
 * dev サーバーの .env.local と同じ AUTH_SECRET を使用する。
 */
async function setAdminSession(page: Page) {
    const secret = process.env.AUTH_SECRET
    if (!secret) {
        throw new Error('AUTH_SECRET が設定されていません。.env.local を確認してください。')
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'ogasawara.yutaka@sapporo.coop'

    // NextAuth v5 の JWT トークンを生成
    const token = await encode({
        token: {
            name: 'E2E Test Admin',
            email: adminEmail,
            picture: '',
            sub: 'e2e-test-admin-id',
        },
        secret,
        salt: 'authjs.session-token',
    })

    // セッション Cookie を設定
    await page.context().addCookies([
        {
            name: 'authjs.session-token',
            value: token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        },
    ])
}

/**
 * 管理者認証済みテスト用フィクスチャ
 *
 * `adminTest` を使うと、テスト実行時に管理者として
 * ログインした状態でブラウザが起動する。
 */
export const adminTest = base.extend({
    page: async ({ page }, use) => {
        await setAdminSession(page)
        await use(page)
    },
})

// 一般ユーザー（未認証）テスト用は標準の test をそのまま使う
export { base as test }
export { expect } from '@playwright/test'
