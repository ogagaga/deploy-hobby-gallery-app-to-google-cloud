import { adminTest, expect } from './auth-setup'

/**
 * 管理者ユーザーの操作フロー E2Eテスト
 *
 * 管理者としてログインした状態で、管理者専用のUI要素が表示され、
 * 作品の作成フォームなどが正しく動作することを検証する。
 */
adminTest.describe('管理者フロー', () => {
    adminTest('トップページに「投稿」ボタンが表示される', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        // 管理者にのみ表示される「投稿」リンクを確認
        const postButton = page.getByRole('link', { name: '投稿' })
        await expect(postButton.first()).toBeVisible()
    })

    adminTest('作品登録ページにアクセスできフォームが表示される', async ({ page }) => {
        await page.goto('/works/new')
        // リダイレクトされず、フォームページが表示される
        await expect(page.getByRole('heading', { name: '作品を登録する' })).toBeVisible()
        // フォームの主要フィールドが存在する（ラベルは「作品名」「ジャンル」）
        await expect(page.getByText('作品名')).toBeVisible()
        await expect(page.getByText('ジャンル')).toBeVisible()
    })

    adminTest('プロジェクト一覧に「作成」ボタンが表示される', async ({ page }) => {
        await page.goto('/projects')
        await page.waitForLoadState('networkidle')
        const createButton = page.getByRole('link', { name: '作成' })
        await expect(createButton).toBeVisible()
    })

    adminTest('プロジェクト作成ページにアクセスできフォームが表示される', async ({ page }) => {
        await page.goto('/projects/new')
        await expect(page.getByText('シリーズ名')).toBeVisible()
        await expect(page.getByText('シリーズの説明')).toBeVisible()
    })

    adminTest('作品詳細ページで編集・削除ボタンが表示される', async ({ page }) => {
        // まずトップページから作品を探す
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // 作品へのリンクを探す（/works/new や /works/XXX/edit は除外）
        const workLinks = page.locator('a[href^="/works/"]').filter({
            hasNot: page.locator(':scope'),
            has: page.locator(':scope'),
        })
        // より安全に: href 属性で UUID パターン相当の作品リンクを探す
        const allLinks = page.locator('a[href^="/works/"]')
        const allCount = await allLinks.count()
        let workHref: string | null = null

        for (let i = 0; i < allCount; i++) {
            const href = await allLinks.nth(i).getAttribute('href')
            // /works/new や /works/XXX/edit を除外
            if (href && href !== '/works/new' && !href.endsWith('/edit')) {
                workHref = href
                break
            }
        }

        if (workHref) {
            await page.goto(workHref)
            await page.waitForLoadState('networkidle')

            // 管理者には「編集」リンクが表示される（Markdownエディタの「編集」タブと区別）
            await expect(page.getByRole('link', { name: '編集' })).toBeVisible()
            // 「削除」ボタン（DeleteButton コンポーネント）が表示される
            await expect(page.getByRole('button', { name: '削除' })).toBeVisible()
        } else {
            // 作品がない場合はスキップ（テスト失敗にしない）
            adminTest.skip()
        }
    })

    adminTest('ログインページで「ログイン済みです」が表示される', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByText('ログイン済みです')).toBeVisible()
    })
})
