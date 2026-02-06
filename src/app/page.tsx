import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkCard } from "@/components/works/work-card";
import { WorkList } from "@/components/works/work-list";
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

      {/* 作品コレクション一覧 (共通) */}
      <div className="w-full">
        <MotionItem className="flex items-center justify-between mb-10 border-b pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tight tracking-tighter">
                作品コレクション
              </h1>
              <Link
                href="/welcome"
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors border px-3 py-1 rounded-full bg-muted/30"
              >
                サイトについて
              </Link>
            </div>
            <p className="text-muted-foreground font-medium text-sm">
              全 {works.length} 点の完成品が展示されています
            </p>
          </div>
          {session && (
            <Button asChild size="lg" className="rounded-full px-8 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-14 text-base font-bold">
              <Link href="/works/new" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                作品を投稿
              </Link>
            </Button>
          )}
        </MotionItem>

        {works.length > 0 ? (
          <WorkList works={works} />
        ) : (
          <MotionItem className="border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 w-full">
            <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6 text-4xl text-foreground">🖼️</div>
            <p className="text-2xl font-bold text-foreground mb-2">まだ作品が登録されていません</p>
            <p className="text-muted-foreground">ギャラリーの公開をお楽しみに！</p>
            {session && (
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link href="/works/new">作品を投稿する</Link>
              </Button>
            )}
          </MotionItem>
        )}
      </div>
    </div>
  );
}
