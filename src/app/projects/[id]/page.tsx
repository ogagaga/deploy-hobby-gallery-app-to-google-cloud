import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper"
import { WorkCard } from "@/components/works/work-card"
import { LayoutGrid, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { ProjectActions } from "@/components/projects/project-actions"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            works: {
                orderBy: { createdAt: "desc" },
                include: { tags: true }
            }
        }
    })

    if (!project) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <MotionContainer className="space-y-12">
                <MotionItem className="space-y-6">
                    <Button asChild variant="ghost" className="rounded-full pl-2 pr-6 h-10 group">
                        <Link href="/projects" className="flex items-center gap-2">
                            <span className="bg-muted p-1.5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </span>
                            <span className="font-bold text-sm">プロジェクト一覧へ戻る</span>
                        </Link>
                    </Button>

                    <div className="flex flex-col md:flex-row gap-10 items-start border-b pb-12">
                        <div className="w-full md:w-1/3 aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted/20 relative">
                            {project.mainImage ? (
                                <img
                                    src={project.mainImage}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                    <LayoutGrid className="w-20 h-20" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-6 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-black tracking-tight tracking-tighter leading-none">
                                        {project.name}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-primary text-primary-foreground text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                                            Project Collection
                                        </span>
                                        <span className="text-muted-foreground font-bold text-sm">
                                            {project.works.length} Works
                                        </span>
                                    </div>
                                </div>
                                {isAdmin && <ProjectActions id={project.id} />}
                            </div>
                            {project.description && (
                                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl italic">
                                    "{project.description}"
                                </p>
                            )}
                        </div>
                    </div>
                </MotionItem>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {project.works.map((work: any) => (
                        <MotionItem key={work.id}>
                            <WorkCard work={work} />
                        </MotionItem>
                    ))}
                </div>

                {project.works.length === 0 && (
                    <MotionItem className="text-center py-20 border-2 border-dashed rounded-[3rem] bg-muted/5">
                        <p className="text-muted-foreground font-bold">このプロジェクトにはまだ作品が登録されていません</p>
                    </MotionItem>
                )}
            </MotionContainer>
        </div>
    )
}
