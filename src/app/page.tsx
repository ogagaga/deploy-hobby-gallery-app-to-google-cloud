import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkCard } from "@/components/works/work-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Work, Tag } from "@prisma/client";
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper";
import { WelcomePopup } from "@/components/auth/welcome-popup";
import { Plus } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      <WelcomePopup userName={session?.user?.name} />

      {session ? (
        <>
          <div className="w-full">
            <MotionItem className="flex items-center justify-between mb-10 border-b pb-8">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight tracking-tighter">
                  作品コレクション
                </h1>
                <p className="text-muted-foreground font-medium text-sm">
                  全 {works.length} 点の完成品が展示されています
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-14 text-base font-bold">
                <Link href="/works/new" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  作品を投稿
                </Link>
              </Button>
            </MotionItem>

            {works.length > 0 ? (
              <MotionContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {works.map((work: Work & { tags: Tag[] }) => (
                  <MotionItem key={work.id}>
                    <WorkCard work={work} />
                  </MotionItem>
                ))}
              </MotionContainer>
            ) : (
              <MotionItem className="border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 w-full">
                <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6 text-4xl text-foreground">🖼️</div>
                <p className="text-2xl font-bold text-foreground mb-2">まだ作品が登録されていません</p>
                <p className="text-muted-foreground">最初の作品を投稿してギャラリーを始めましょう！</p>
                <Button asChild variant="outline" className="mt-8 rounded-full">
                  <Link href="/works/new">作品を投稿する</Link>
                </Button>
              </MotionItem>
            )}
          </div>
        </>
      ) : (
        <MotionContainer className="max-w-4xl space-y-16 py-20">
          <MotionItem className="space-y-8 text-center">
            <h1 className="text-6xl font-black tracking-tight lg:text-8xl text-foreground tracking-tighter leading-[0.9]">
              プラモデル完成品を<br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                美しく、体系的に。
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Hobby Galleryは、あなたのプラモデル制作の記録を写真と共に美しく保存・管理するための、あなただけのデジタル展示室です。
            </p>
          </MotionItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-4">
            <MotionItem className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                🖼️
              </div>
              <h3 className="text-xl font-black mb-3 text-foreground">美しく展示</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">お気に入りの写真を高画質でディスプレイ。</p>
            </MotionItem>
            <MotionItem className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                🏷️
              </div>
              <h3 className="text-xl font-black mb-3 text-foreground">タグで整理</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">ジャンルや塗装手法で素早く検索・管理。</p>
            </MotionItem>
            <MotionItem className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                📘
              </div>
              <h3 className="text-xl font-black mb-3 text-foreground">技術を記録</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">使用塗料や改造ポイントを詳細に記録。</p>
            </MotionItem>
          </div>
        </MotionContainer>
      )}
    </div>
  );
}
