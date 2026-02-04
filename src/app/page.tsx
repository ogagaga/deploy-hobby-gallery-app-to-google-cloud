import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkCard } from "@/components/works/work-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Work, Tag } from "@prisma/client";

export default async function Home() {
  const session = await auth();

  // 作品データを取得（新着順）
  const works = await prisma.work.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      {session ? (
        <>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              おかえりなさい、{session.user?.name || "モデラー"}さん
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              あなたの素晴らしい完成品をギャラリーに追加しましょう。
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                <Link href="/works/new">作品を投稿する</Link>
              </Button>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold tracking-tight">作品コレクション ({works.length})</h2>
            </div>

            {works.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {works.map((work: Work & { tags: Tag[] }) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed rounded-2xl p-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 w-full animate-in fade-in duration-500">
                <p className="text-lg">まだ作品が登録されていません</p>
                <p className="text-sm mt-2">最初の作品を投稿してギャラリーを始めましょう！</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-3xl space-y-12 py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="space-y-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground">
              プラモデル完成品を<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                美しく、体系的に。
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hobby Galleryは、あなたのプラモデル制作の記録を写真と共に美しく保存・管理するための自分専用ギャラリーアプリです。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                🖼️
              </div>
              <h3 className="font-bold mb-2 text-foreground">美しく展示</h3>
              <p className="text-sm text-muted-foreground">お気に入りの写真を高画質でディスプレイ。</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
                🏷️
              </div>
              <h3 className="font-bold mb-2 text-foreground">タグで整理</h3>
              <p className="text-sm text-muted-foreground">ジャンルや塗装手法で素早く検索・管理。</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                📘
              </div>
              <h3 className="font-bold mb-2 text-foreground">技術を記録</h3>
              <p className="text-sm text-muted-foreground">使用塗料や改造ポイントを詳細に記録。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
