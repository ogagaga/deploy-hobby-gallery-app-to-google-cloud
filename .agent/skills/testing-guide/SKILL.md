---
name: testing-guide
description: Vitest + Testing Library によるテスト作成ガイド。モックパターン集とベストプラクティス。
---

# テスト作成ガイド

本プロジェクトにおけるテスト作成の指針とモックパターンをまとめた Skill です。
テストフレームワークとして **Vitest** + **@testing-library/react** を使用しています。

## テスト環境

- **フレームワーク**: Vitest (`vitest.config.ts`)
- **環境**: `jsdom`
- **セットアップ**: `src/test/setup.ts`
- **モック定義**: `src/test/mocks.ts`

## テスト実行コマンド

```bash
# 全テスト実行
npm run test

# 特定ファイルのみ
npm run test <ファイルパス>

# ウォッチモード
npx vitest <ファイルパス>
```

---

## モックパターン集

### 1. framer-motion のモック

`framer-motion` は JSDOM 環境で動作しないため、モックが必要です。

#### パターンA: `importOriginal` を使用（推奨）

`motion.div` 等のプロパティアクセスのみ使う場合（例: WorkForm）。
元のエクスポートを継承しつつ、問題のあるコンポーネントだけ上書きします。

```tsx
vi.mock('framer-motion', async (importOriginal) => {
    const actual = await importOriginal<typeof import('framer-motion')>()
    return {
        ...actual,
        Reorder: {
            Group: ({ children, className }: { children: React.ReactNode, className?: string }) =>
                <div className={className}>{children}</div>,
            Item: ({ children, className }: { children: React.ReactNode, className?: string }) =>
                <div className={className}>{children}</div>,
        },
    }
})
```

#### パターンB: Proxy + キャッシュ（`motion()` 関数呼び出しがある場合）

`motion(Component)` のように関数として呼び出される場合（例: Button の `motion(Slot.Root)`）。
Proxy の `apply` トラップで関数呼び出しを処理し、`get` トラップでプロパティアクセスを処理します。
**コンポーネントをキャッシュしないと、毎回新しいコンポーネントが生成されてリマウントが発生する**点に注意。

```tsx
vi.mock('framer-motion', () => {
    const componentCache = new Map();
    const motion = new Proxy(() => { }, {
        get: (_target, property) => {
            if (!componentCache.has(property)) {
                componentCache.set(property, ({ children, ...props }: any) => {
                    const Tag = property as any;
                    const {
                        layoutId, whileHover, whileTap, initial,
                        animate, exit, transition, drag,
                        dragConstraints, dragElastic, onDragEnd,
                        ...domProps
                    } = props;
                    return <Tag {...domProps}>{children}</Tag>;
                });
            }
            return componentCache.get(property);
        },
        apply: (_target, _thisArg, argumentsList) => {
            // motion(Component) 呼び出しに対応: 元のコンポーネントをそのまま返す
            return argumentsList[0];
        }
    });

    return {
        motion,
        AnimatePresence: ({ children }: any) => <>{children}</>,
    }
})
```

### 2. next/image のモック

`next/image` の `Image` コンポーネントは最適化 URL（`/_next/image?url=...`）を生成するため、
`src` 属性を直接検証したい場合はモックが必要です。

```tsx
vi.mock('next/image', () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />
}))
```

### 3. Prisma のモック（`src/test/mocks.ts`）

テスト用の Prisma モックは `src/test/mocks.ts` に集約されています。
新しいモデルやメソッドが必要になった場合は、ここに追加します。

```typescript
// src/test/mocks.ts の prismaMock にメソッドを追加する例:
export const prismaMock = {
    work: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    image: {
        create: vi.fn(),
        deleteMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
    },
    $transaction: vi.fn((fn) => fn(prismaMock)),
}
```

**トランザクション (`$transaction`) を使う関数のテスト**:
`$transaction` は受け取った関数に `prismaMock` 自身を渡すことで、
トランザクション内の `tx.work.update()` 等が `prismaMock.work.update()` として呼ばれます。

### 4. 認証のモック

```typescript
import { mockSession } from '@/test/mocks'

// 管理者としてログイン
mockSession.mockResolvedValue({
    user: { email: 'admin@example.com' },
    expires: '',
})

// 未認証
mockSession.mockResolvedValue(null)
```

### 5. ファイルアップロード（Storage）のモック

```typescript
vi.mock('@/lib/storage', () => ({
    saveImage: vi.fn().mockResolvedValue('/mocked-url.jpg'),
    deleteImage: vi.fn().mockResolvedValue(undefined),
}))
```

### 6. 画像圧縮のモック

```typescript
vi.mock('@/lib/image-compression', () => ({
    compressImage: vi.fn((file) => Promise.resolve(file)),
}))
```

---

## ベストプラクティス

### テストデータ作成

- `FormData` のテストでは、未入力フィールドは **空文字列 `''`** を使用する（`null` ではなく）
- ファイルフィールドには適切な MIME タイプと最小限のコンテンツを持つ `File` オブジェクトを渡す

```typescript
const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' })
formData.append('mainImage', file)
```

### アサーション

- **認可エラー**: `{ success: false, error: "エラーメッセージ" }` の形式を期待する
- **要素の検索**: `getByRole`, `getByLabelText`, `getByText` を優先し、`getByTestId` は最後の手段
- `aria-label` を活用して、テスト可能かつアクセシブルな UI を構築する

### TDD サイクル

プロジェクトルール (GEMINI.md) により、新機能は **TDD (Red-Green-Refactor)** で進めます:

1. **Red**: まずテストを書き、失敗を確認
2. **Green**: テストを通す最小限の実装
3. **Refactor**: コードを整理（テストが通ったまま）
