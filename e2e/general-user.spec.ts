import { test, expect } from './auth-setup'

/**
 * 一般ユーザー（未認証）の閲覧フロー E2Eテスト
 *
 * ログインしていない状態で、主要なページが正しく表示され、
 * ページ遷移が機能することを検証する。
 */
test.describe('一般ユーザーフロー', () => {
    test('トップページが表示され、タイトルが正しい', async ({ page }) => {
        await page.goto('/')
        // サイトタイトルを確認
        await expect(page).toHaveTitle(/Oga.*Plastic Model Gallery/i)
    })

    test('トップページのメインコンテンツが表示される', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        // ページが正常に読み込まれたことを確認
        await expect(page.locator('body')).toBeVisible()
    })

    test('未認証時は「投稿」ボタンが表示されない', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        // 「投稿」ボタン（リンク）が表示されないことを確認
        const postButton = page.getByRole('link', { name: '投稿' })
        await expect(postButton).toHaveCount(0)
    })

    test('プロジェクト（シリーズ）一覧ページに遷移できる', async ({ page }) => {
        await page.goto('/projects')
        // 「シリーズ」というヘッダーが表示される
        await expect(page.getByRole('heading', { name: 'シリーズ' })).toBeVisible()
    })

    test('存在しないページにアクセスすると 404 が表示される', async ({ page }) => {
        await page.goto('/nonexistent-page-12345')
        // 「展示品が見つかりませんでした」見出しが表示される
        await expect(
            page.getByRole('heading', { name: '展示品が見つかりませんでした' })
        ).toBeVisible({ timeout: 15_000 })
    })

    test('作品が存在する場合、作品カードが表示される', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // 作品カードまたは空メッセージの存在を確認
        const workLinks = page.locator('a[href^="/works/"]')
        const emptyState = page.getByText('まだ作品が登録されていません')

        const hasLinks = await workLinks.count() > 0
        const hasEmpty = await emptyState.isVisible().catch(() => false)
        expect(hasLinks || hasEmpty).toBeTruthy()
    })

    test('ログインページが表示される', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByRole('heading', { name: '管理者ログイン' })).toBeVisible()
    })
})
