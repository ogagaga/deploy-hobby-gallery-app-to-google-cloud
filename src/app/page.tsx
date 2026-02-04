import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {session ? (
        <>
          <h1 className="text-4xl font-bold tracking-tight">おかえりなさい、{session.user?.name || "モデラー"}さん</h1>
          <p className="text-xl text-muted-foreground">
            あなたの素晴らしい完成品をギャラリーに追加しましょう。
          </p>
          <div className="flex gap-4 mt-6">
            <a href="/works/new" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              作品を投稿する
            </a>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* ここに作品一覧が表示されます */}
            <div className="border border-dashed rounded-lg p-12 flex items-center justify-center text-muted-foreground bg-muted/20 w-full col-span-full">
              まだ作品が登録されていません
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold tracking-tight">プラモデル完成品を美しく、体系的に。</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Hobby Galleryは、あなたのプラモデル制作の記録を写真と共に美しく保存・管理するための自分専用ギャラリーアプリです。
          </p>
        </>
      )}
    </div>
  );
}
