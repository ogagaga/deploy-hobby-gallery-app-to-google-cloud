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
    <div className="flex flex-col items-center justify-center space-y-3 py-2">
      <WelcomePopup userName={session?.user?.name} />

      {/* 作品コレクション一覧 (共通) */}
      <div className="w-full">
        <MotionItem className="hidden md:flex items-center justify-between mb-2 border-b pb-2">
          <h1 className="text-2xl font-black tracking-tight tracking-tighter">
            作品コレクション
          </h1>
          {session && (
            <Button asChild size="sm" className="rounded-full px-6 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-10 text-sm font-bold">
              <Link href="/works/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                投稿
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
