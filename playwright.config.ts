import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2Eテスト設定
 *
 * 使用方法:
 *   1. Docker DB を起動: docker compose up -d db
 *   2. マイグレーション: npx prisma migrate deploy
 *   3. シードデータ: npx prisma db seed
 *   4. テスト実行: npx playwright test
 */
export default defineConfig({
    // テストファイルのディレクトリ
    testDir: './e2e',

    // テスト結果の出力先
    outputDir: './e2e/test-results',

    // 各テストのタイムアウト（30秒）
    timeout: 30_000,

    // テストの期待値（expect）のタイムアウト
    expect: {
        timeout: 10_000,
    },

    // テストの並列実行（CIでは直列、ローカルでは並列）
    fullyParallel: true,

    // CI環境ではリトライしない
    retries: process.env.CI ? 1 : 0,

    // レポーター
    reporter: [
        ['html', { outputFolder: './playwright-report', open: 'never' }],
        ['list'],
    ],

    // 全テスト共通設定
    use: {
        baseURL: 'http://localhost:3000',
        // スクリーンショット（失敗時のみ）
        screenshot: 'only-on-failure',
        // トレース（失敗時のみ）
        trace: 'on-first-retry',
    },

    // テスト対象ブラウザ（Chromium のみ = 高速化）
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // 開発サーバーの自動起動
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
    },
})
