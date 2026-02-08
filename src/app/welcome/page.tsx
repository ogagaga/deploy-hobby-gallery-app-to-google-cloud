import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-6 px-4">
            {/* ヒーローセクション */}
            <MotionContainer className="max-w-4xl space-y-4 text-center">
                <MotionItem className="space-y-4">
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        Oga&apos;s Plastic Model Galleryは、私が趣味で製作しているプラモデル制作の写真と内容を記録しているサイトです。
                    </p>
                    <div className="pt-2">
                        <Button asChild size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all duration-500">
                            <Link href="/">
                                ギャラリーを見る
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </MotionItem>
            </MotionContainer>

            {/* 特徴紹介セクション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-6xl">
                <MotionItem className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                        🖼️
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-foreground tracking-tight">美しく展示</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        お気に入りの作品写真を最高のクオリティでディスプレイ。制作の軌跡をいつまでも鮮明に。
                    </p>
                </MotionItem>

                <MotionItem className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                        🏷️
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-foreground tracking-tight">タグで整理</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        ジャンルや塗装手法、スケールなどで自由にタグ付け。見たい作品へ瞬時にアクセス。
                    </p>
                </MotionItem>

                <MotionItem className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border ring-1 ring-zinc-200/50 dark:ring-zinc-800 transition-all hover:scale-105 duration-500">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                        📘
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-foreground tracking-tight">技術を記録</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        使用した塗料や独自の改造ポイントを詳細に記録。次回の制作をより高い次元へ。
                    </p>
                </MotionItem>
            </div>

            {/* フッター的な誘導 */}
            <MotionItem className="text-center pt-4">
                <Link href="/" className="text-primary font-black hover:underline underline-offset-8 transition-all">
                    トップページへ戻る
                </Link>
            </MotionItem>
        </div>
    );
}
