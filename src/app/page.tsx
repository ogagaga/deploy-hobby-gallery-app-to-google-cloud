import { auth } from "@/auth";
import { getWorks } from "@/app/actions/work";
import { InfiniteWorkList } from "@/components/works/infinite-work-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MotionItem } from "@/components/animations/motion-wrapper";
import { WelcomePopup } from "@/components/auth/welcome-popup";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { WorkListSkeleton } from "@/components/works/work-card-skeleton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      <WelcomePopup userName={session?.user?.name} />

      {/* 作品コレクション一覧 (共通) */}
      <div className="w-full">
        <MotionItem className="hidden md:flex items-center justify-between mb-4 border-b pb-4">
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
            {/* 作品数は WorksSection 内で動的に表示するのがベストだが、一旦コンテナだけ表示 */}
            <p className="text-muted-foreground font-medium text-sm">
              最新の完成品を展示しています
            </p>
          </div>
          {session && (
            <Button asChild size="lg" className="rounded-full px-8 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-12 text-base font-bold">
              <Link href="/works/new" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                作品を投稿
              </Link>
            </Button>
          )}
        </MotionItem>

        <Suspense fallback={<WorkListSkeleton />}>
          <WorksSection session={!!session} />
        </Suspense>
      </div>
    </div>
  );
}

async function WorksSection({ session }: { session: boolean }) {
  const result = await getWorks(1, 8);
  const works = result.works;

  if (works.length === 0) {
    return (
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
    );
  }

  return (
    <InfiniteWorkList
      initialWorks={works}
      initialHasMore={result.hasMore}
      initialTotal={result.total}
    />
  );
}
