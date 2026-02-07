import { getProjects } from "@/app/actions/project"
import { auth } from "@/auth"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, LayoutGrid, FolderOpen } from "lucide-react"

export default async function ProjectsPage() {
    const session = await auth()
    const projects = await getProjects()

    return (
        <div className="container mx-auto py-10 px-4">
            <MotionContainer className="space-y-12">
                <MotionItem className="flex items-center justify-between border-b pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight tracking-tighter flex items-center gap-3">
                            <FolderOpen className="w-10 h-10 text-primary" />
                            プロジェクト / シリーズ
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm">
                            テーマやシリーズごとにまとめられた作品集です
                        </p>
                    </div>
                    {session?.user?.email === process.env.ADMIN_EMAIL && (
                        <Button asChild size="lg" className="rounded-full px-8 shadow-xl hover:shadow-primary/20 transition-all duration-300 h-14 text-base font-bold">
                            <Link href="/projects/new" className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                プロジェクトを作成
                            </Link>
                        </Button>
                    )}
                </MotionItem>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any) => (
                            <MotionItem key={project.id}>
                                <Link href={`/projects/${project.id}`}>
                                    <Card className="group relative overflow-hidden border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 ring-1 ring-inset ring-foreground/5 hover:ring-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                                        <CardHeader className="p-0 aspect-[16/9] bg-muted/20 relative overflow-hidden">
                                            {project.mainImage ? (
                                                <img
                                                    src={project.mainImage}
                                                    alt={project.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                                    <LayoutGrid className="w-20 h-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-2xl font-black tracking-tight">{project.name}</h2>
                                                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                                                    {project._count.works} Works
                                                </span>
                                            </div>
                                            {project.description && (
                                                <p className="text-muted-foreground text-sm line-clamp-2 font-medium leading-relaxed">
                                                    {project.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </MotionItem>
                        ))}
                    </div>
                ) : (
                    <MotionItem className="border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 w-full">
                        <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6 text-4xl text-foreground">📁</div>
                        <p className="text-2xl font-bold text-foreground mb-2">まだプロジェクトがありません</p>
                        <p className="text-muted-foreground text-center max-w-sm">
                            「MG ジム・バリエーション」などのテーマを作成して、作品をグループ化しましょう。
                        </p>
                        {session?.user?.email === process.env.ADMIN_EMAIL && (
                            <Button asChild variant="outline" className="mt-8 rounded-full h-12 px-8">
                                <Link href="/projects/new">最初のプロジェクトを作成</Link>
                            </Button>
                        )}
                    </MotionItem>
                )}
            </MotionContainer>
        </div>
    )
}
